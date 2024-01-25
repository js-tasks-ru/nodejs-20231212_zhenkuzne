const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      done(null, false, 'Не указан email');
      return;
    }

    const user = await User.findOne({email});

    if (user) {
      done(null, user);
      return;
    }

    done(null, await User.create({email, displayName}));
  } catch (error) {
    done(error);
  }
};
