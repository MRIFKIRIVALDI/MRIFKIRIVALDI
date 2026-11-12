import { rm } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');

if (!outputDirectory.startsWith(`${projectRoot}${sep}`)) {
  throw new Error('Build output harus berada di dalam folder proyek.');
}

await rm(outputDirectory, { recursive: true, force: true });
console.log('Output build sementara dist/ sudah dibersihkan.');
