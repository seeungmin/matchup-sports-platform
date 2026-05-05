import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [, , rootArg, portArg = '8765', host = '127.0.0.1'] = process.argv;

if (!rootArg) {
  console.error('Usage: node serve-static-file.mjs <root> [port] [host]');
  process.exit(1);
}

const root = path.resolve(rootArg);
const port = Number(portArg);
const defaultFile = 'Teameet Design.html';

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
]);

function resolveRequestPath(url) {
  const parsed = new URL(url, `http://${host}:${port}`);
  const requestPath = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');
  const targetPath = path.resolve(root, requestPath || defaultFile);

  if (targetPath !== root && !targetPath.startsWith(`${root}${path.sep}`)) {
    return null;
  }

  return targetPath;
}

const server = http.createServer((req, res) => {
  const targetPath = resolveRequestPath(req.url ?? '/');

  if (!targetPath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  if (!existsSync(targetPath) || !statSync(targetPath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(targetPath).toLowerCase();
  res.writeHead(200, {
    'Content-Type': contentTypes.get(ext) ?? 'application/octet-stream',
  });
  createReadStream(targetPath).pipe(res);
});

server.listen(port, host, () => {
  const scriptName = path.basename(fileURLToPath(import.meta.url));
  console.log(`${scriptName}: serving ${root} at http://${host}:${port}/`);
});
