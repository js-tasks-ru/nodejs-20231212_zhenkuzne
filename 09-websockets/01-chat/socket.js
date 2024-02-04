const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;

    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
      return;
    }

    const session = await Session.findOne({token}).populate('user');

    if (!session) {
      next(new Error('wrong or expired session token'));
      return;
    }

    socket.user = session.user;
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const {user} = socket;

      await Message.create({
        user: user.displayName,
        chat: user.id,
        text: msg,
        date: new Date(),
      });
    });
  });

  return io;
}

module.exports = socket;
