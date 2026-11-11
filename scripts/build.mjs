import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(projectRoot, 'dist');

if (!outputDirectory.startsWith(`${projectRoot}${sep}`)) {
  throw new Error('Build output harus berada di dalam folder proyek.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(join(projectRoot, 'index.html'), join(outputDirectory, 'index.html'));
await cp(join(projectRoot, 'src'), join(outputDirectory, 'src'), { recursive: true });
await cp(join(projectRoot, 'images'), join(outputDirectory, 'images'), { recursive: true });

console.log(`Static build siap di ${outputDirectory}`);
