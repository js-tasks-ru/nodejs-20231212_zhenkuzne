const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

/**
 * Для решения проблем с тестом "ошибка 413"
 * Соединение не закрвыается на Node 20
 * И `after((done) => {` падает, так как не дожидается `server.close(done)`
 */
(function patchClose() {
  const originalClose = server.close.bind(server)

  server.close = (...args) => {
    server.closeAllConnections()
    originalClose(...args)
  }
})()

const logError = (message, err) => {
  if (err) {
    console.log(`${message};`, err)
  }
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
        break;
      }

      const writeableStream = fs.createWriteStream(filepath, {
        flags: 'wx'
      });
      
      const limitedStream = new LimitSizeStream({limit: 1 * 1024 * 1024})

      const removeFile = () => fs.unlink(filepath, (err) => logError('Remove file error', err))

      req.on('close', () => {
        if (!req.complete) {
          writeableStream.close()
          removeFile()
        }
      })

      writeableStream.on('error', (err) => {
        logError('Write file error', err)

        if (err.code === 'EEXIST') {
          res.statusCode = 409;
        } else {
          res.statusCode = 500;
        }

        res.end();
      })

      writeableStream.on('finish', () => {
        res.statusCode = 201;
        res.end();
      })

      limitedStream.on('error', (err) => {
        logError('Size limit error', err)

        if (err.code === 'LIMIT_EXCEEDED') {
          removeFile()
          res.statusCode = 413;
        } else {
          res.statusCode = 500;
        }

        res.end();
      })

      req.pipe(limitedStream).pipe(writeableStream)
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
