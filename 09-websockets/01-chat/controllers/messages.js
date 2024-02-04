const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const {user} = ctx;
  const messages = await Message.find({user: user.displayName}, null, {limit: 20});

  ctx.body = {messages: messages.map(mapMessage)};
};
