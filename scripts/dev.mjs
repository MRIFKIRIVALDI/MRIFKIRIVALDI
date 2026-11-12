import './build.mjs';
import { createReadStream, statSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = join(projectRoot, 'dist');
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = createServer((request, response) => {
  const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestPath === '/' ? 'index.html' : normalize(requestPath).replace(/^[/\\]+/, '');
  const filePath = resolve(publicRoot, relativePath);

  if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  try {
    if (!statSync(filePath).isFile()) throw new Error('Not a file');
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream' });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

const cleanBuildOutput = () => rm(publicRoot, { recursive: true, force: true });

const shutdown = () => {
  server.close(async () => {
    await cleanBuildOutput();
    process.exit(0);
  });
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

server.on('error', async (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} sedang digunakan. Tutup preview lama atau jalankan dengan: $env:PORT=4174; npm.cmd run dev`);
    await cleanBuildOutput();
    process.exitCode = 1;
    return;
  }
  throw error;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}`);
});
