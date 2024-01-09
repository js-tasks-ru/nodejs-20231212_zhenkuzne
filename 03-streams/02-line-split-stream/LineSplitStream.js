const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #lastLine = ''

  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const lines = `${this.#lastLine}${chunk.toString()}`.split(os.EOL)
    this.#lastLine = lines.pop()

    lines.forEach(line => this.push(line))
    callback()
  }

  _flush(callback) {
    callback(null, this.#lastLine)
  }
}

module.exports = LineSplitStream;
