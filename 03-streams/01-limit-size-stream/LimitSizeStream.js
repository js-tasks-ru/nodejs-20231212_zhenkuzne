const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #limit = Infinity
  #size = 0

  constructor({limit, ...options}) {
    super(options);
    this.#limit = limit
  }

  _transform(chunk, encoding, callback) {
    this.#size += chunk.length

    if (this.#size > this.#limit) {
      callback(new LimitExceededError());
      return
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
