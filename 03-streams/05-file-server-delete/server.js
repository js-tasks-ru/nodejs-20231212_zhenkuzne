const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
        break;
      }

      fs.unlink(filepath, (err) => {
        res.statusCode = (() => {
          if (!err) {
            return 200
          }

          if (err.code === 'ENOENT') {
            return 404
          }

          return 500
        })()

        res.end();
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
