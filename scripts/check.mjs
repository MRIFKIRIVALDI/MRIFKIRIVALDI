import { access, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const sourceFiles = [
  'src/data/content.js',
  'src/scripts/galaxy.js',
  'src/scripts/hero-robot.js',
  'src/scripts/main.js',
  'src/scripts/render.js',
  'src/scripts/theme.js',
  'scripts/build.mjs',
  'scripts/dev.mjs',
];

for (const file of sourceFiles) {
  const result = spawnSync(process.execPath, ['--check', join(projectRoot, file)], { encoding: 'utf8' });
  if (result.status !== 0) failures.push(`${file}: ${result.stderr.trim() || 'syntax error'}`);
}

const index = await readFile(join(projectRoot, 'index.html'), 'utf8');
const content = await readFile(join(projectRoot, 'src/data/content.js'), 'utf8');
const mainCss = await readFile(join(projectRoot, 'src/styles/main.css'), 'utf8');
const references = new Set([...index.matchAll(/["'](\.\/(?:assets|src)\/[^"']+)["']/g)].map((match) => match[1]));
for (const match of content.matchAll(/["'](\.\/assets\/[^"']+)["']/g)) references.add(match[1]);

for (const reference of references) {
  const sourcePath = reference.startsWith('./assets/')
    ? join(projectRoot, 'src', reference.slice(2))
    : join(projectRoot, reference.slice(2));
  try { await access(sourcePath); } catch { failures.push(`Missing local reference: ${reference}`); }
}

for (const match of mainCss.matchAll(/@import url\(['"](.+?)['"]\)/g)) {
  const cssPath = join(projectRoot, 'src/styles', match[1]);
  try { await access(cssPath); } catch { failures.push(`Missing CSS import: ${match[1]}`); }
}

const ids = [...index.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]);
const duplicateIds = ids.filter((id, indexOfId) => ids.indexOf(id) !== indexOfId);
if (duplicateIds.length) failures.push(`Duplicate HTML ids: ${[...new Set(duplicateIds)].join(', ')}`);

const idSet = new Set(ids);
for (const match of index.matchAll(/href=["']#([^"']+)["']/g)) {
  if (!idSet.has(match[1])) failures.push(`Broken internal anchor: #${match[1]}`);
}

const hosting = JSON.parse(await readFile(join(projectRoot, '.openai/hosting.json'), 'utf8'));
if (hosting.static?.directory !== 'dist') failures.push('Hosting static.directory must be dist.');

if (failures.length) {
  console.error(`Validation failed (${failures.length}):\n- ${failures.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Validation passed: ${sourceFiles.length} JavaScript files, ${references.size} local references, and ${ids.length} HTML ids checked.`);
}
