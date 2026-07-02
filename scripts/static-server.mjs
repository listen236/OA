import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const rootDir = process.cwd();
const port = Number(process.env.PORT || '8123');
const host = process.env.HOST || '127.0.0.1';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

http
  .createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const filePath = path.resolve(rootDir, relativePath);

    if (!filePath.startsWith(rootDir)) {
      response.statusCode = 403;
      response.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.statusCode = error.code === 'ENOENT' ? 404 : 500;
        response.end(error.code === 'ENOENT' ? 'Not Found' : 'Internal Server Error');
        return;
      }

      response.setHeader('Content-Type', mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
      response.end(content);
    });
  })
  .listen(port, host, () => {
    console.log(`Static server running at http://${host}:${port}`);
  });
