import { access, readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
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
  'scripts/check.mjs',
  'scripts/dev.mjs',
];

const excludedDirectories = new Set(['.git', 'dist', 'outputs']);

async function collectFiles(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(absolutePath, files);
    else files.push(absolutePath);
  }
  return files;
}

async function collectDirectories(directory, directories = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || excludedDirectories.has(entry.name)) continue;
    const absolutePath = join(directory, entry.name);
    directories.push(absolutePath);
    await collectDirectories(absolutePath, directories);
  }
  return directories;
}

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

const projectFiles = await collectFiles(projectRoot);
const sourceIndexFiles = projectFiles
  .filter((file) => file.endsWith(`${sep}index.html`))
  .map((file) => relative(projectRoot, file));
if (sourceIndexFiles.length !== 1 || sourceIndexFiles[0] !== 'index.html') {
  failures.push(`Expected exactly one source index.html, found: ${sourceIndexFiles.join(', ') || 'none'}`);
}

const sourceDirectories = (await collectDirectories(projectRoot))
  .filter((directory) => directory.endsWith(`${sep}src`))
  .map((directory) => relative(projectRoot, directory));
if (sourceDirectories.length !== 1 || sourceDirectories[0] !== 'src') {
  failures.push(`Expected exactly one source directory, found: ${sourceDirectories.join(', ') || 'none'}`);
}

const retiredPaths = ['docs/archive', 'docs/design-reference', 'docs/source-assets'];
for (const retiredPath of retiredPaths) {
  try {
    await access(join(projectRoot, retiredPath));
    failures.push(`Retired duplicate path still exists: ${retiredPath}`);
  } catch {}
}

const runtimeText = `${index}\n${content}\n${await Promise.all(
  projectFiles
    .filter((file) => file.startsWith(join(projectRoot, 'src')) && /\.(?:css|js)$/.test(file))
    .map((file) => readFile(file, 'utf8')),
).then((parts) => parts.join('\n'))}`;
const assetRoot = join(projectRoot, 'src/assets');
const unusedAssets = (await collectFiles(assetRoot))
  .map((file) => relative(assetRoot, file).split(sep).join('/'))
  .filter((asset) => !runtimeText.includes(asset));
if (unusedAssets.length) failures.push(`Unused production assets: ${unusedAssets.join(', ')}`);

if (/\.(?:\/|\\)images\//.test(index) || /docs\/(?:archive|design-reference|source-assets)/.test(runtimeText)) {
  failures.push('A legacy image or documentation path is still referenced by runtime source.');
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
  console.log(`Validation passed: ${sourceFiles.length} JavaScript files, ${references.size} local references, ${ids.length} HTML ids, one source index, one src directory, and all production assets checked.`);
}
