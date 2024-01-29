const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const user = await User.findOne({email});

  if (user) {
    ctx.status = 400;

    ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };

    return;
  }

  const verificationToken = uuid();

  const createdUser = await User.create({
    email,
    displayName,
    verificationToken,
  });

  await createdUser.setPassword(password);
  await createdUser.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});

  if (!user) {
    ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    return;
  }

  user.verificationToken = undefined;
  await user.save();

  ctx.body = {token: await ctx.login(user)};
};
