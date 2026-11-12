import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const historyDirectory = resolve(projectRoot, 'docs', 'commit-history');
const expectedDirectory = `${resolve(projectRoot, 'docs')}${sep}`;

if (!historyDirectory.startsWith(expectedDirectory)) {
  throw new Error('Folder riwayat commit harus berada di dalam docs/.');
}

const descriptions = new Map([
  ['fbf37b6', 'Membuat versi awal portofolio Aetheria Glass beserta struktur HTML, CSS modular, JavaScript, PRD, dan konfigurasi hosting.'],
  ['6b8bfe3', 'Mengubah Hero menjadi layout tiga bagian dan menambahkan robot astronot interaktif berbasis Three.js.'],
  ['71ea21b', 'Mengintegrasikan foto profil, ikon sosial, gambar proyek, sertifikat, serta menyempurnakan robot dan konten portofolio.'],
  ['8487712', 'Merombak struktur project menjadi satu src, memindahkan aset ke folder semantik, dan menambahkan build, check, dev, serta dokumentasi arsitektur.'],
  ['c81f906', 'Memperbaiki foto About Me beresolusi tinggi, mengganti huruf latar menjadi R, dan memperbaiki pesan error preview.'],
  ['fa0ee91', 'Melakukan audit menyeluruh, menghapus snapshot dan aset duplikat, serta menambahkan laporan audit dan sistem desain.'],
  ['ce30e5b', 'Menjadikan dist sebagai output sementara, menambahkan clean script, dan menjaga root hanya memiliki satu src serta satu index.html.'],
  ['59da806', 'Memperbaiki seluruh path gambar ke src/assets agar gambar tampil dari root preview maupun deployment.'],
  ['871172f', 'Menambahkan 30 kartu Tools & Skills dengan 31 logo, link eksternal, responsivitas, dan varian logo GPT untuk kedua tema.'],
  ['d99804c', 'Menambahkan Microsoft Word, Excel, PowerPoint, dan Canva sehingga Tools & Skills berisi 34 kartu.'],
]);

function git(args) {
  const result = spawnSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} gagal.`);
  return result.stdout;
}

function markdown(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\r', '').replaceAll('\n', ' ');
}

function describe(commit, files) {
  if (descriptions.has(commit.short)) return descriptions.get(commit.short);
  if (commit.subject !== 'Update Site source') return commit.subject;
  const preview = files.slice(0, 4).map((file) => `\`${file.path}\``).join(', ');
  return `Memperbarui ${files.length} file${preview ? `, termasuk ${preview}` : ''}.`;
}

const rawLog = git(['log', '--format=%H%x1f%h%x1f%aI%x1f%an%x1f%ae%x1f%s%x1e']);
const commits = rawLog
  .split('\x1e')
  .map((record) => record.trim())
  .filter(Boolean)
  .map((record) => {
    const [sha, short, date, author, email, subject] = record.split('\x1f');
    return { sha, short, date, author, email, subject };
  });

await mkdir(historyDirectory, { recursive: true });
const expectedFiles = new Set(commits.map((commit) => `${commit.short}.md`));
for (const entry of await readdir(historyDirectory, { withFileTypes: true })) {
  if (entry.isFile() && /^[0-9a-f]{7,40}\.md$/i.test(entry.name) && !expectedFiles.has(entry.name)) {
    await rm(join(historyDirectory, entry.name), { force: true });
  }
}

const indexRows = [];
for (const commit of commits) {
  const files = git(['diff-tree', '--root', '--no-commit-id', '--name-status', '-r', '-M', commit.sha])
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [status, ...paths] = line.split('\t');
      return { status, path: paths.join(' → ') };
    });
  const summary = git(['show', '--shortstat', '--format=', commit.sha]).trim() || 'Tidak ada statistik perubahan.';
  const description = describe(commit, files);
  indexRows.push(`| [\`${commit.short}\`](./${commit.short}.md) | ${commit.date.slice(0, 10)} | ${markdown(description)} | ${files.length} |`);

  const fileRows = files.length
    ? files.map((file) => `| \`${markdown(file.status)}\` | \`${markdown(file.path)}\` |`).join('\n')
    : '| - | Tidak ada perubahan file |';
  const document = `# Commit ${commit.short}\n\n${description}\n\n## Identitas\n\n| Field | Nilai |\n| --- | --- |\n| SHA lengkap | \`${commit.sha}\` |\n| Tanggal | ${commit.date} |\n| Author | ${markdown(commit.author)} <${markdown(commit.email)}> |\n| Pesan asli | ${markdown(commit.subject)} |\n| Statistik | ${markdown(summary)} |\n\n## File yang berubah\n\n| Status | Path |\n| --- | --- |\n${fileRows}\n\n## Periksa versi ini\n\n\`\`\`powershell\ngit show --stat ${commit.sha}\ngit switch --detach ${commit.sha}\n\`\`\`\n\nKembali ke branch utama:\n\n\`\`\`powershell\ngit switch main\n\`\`\`\n\n## Pulihkan project ke versi ini tanpa menghapus riwayat\n\nPastikan working tree bersih, lalu jalankan:\n\n\`\`\`powershell\ngit restore --source=${commit.sha} --staged --worktree .\ngit commit -m "revert: restore project to ${commit.short}"\ngit push origin main\n\`\`\`\n\nSetelah rollback, lakukan validasi dan publikasi ulang agar website aktif memakai commit pemulihan baru. Hindari \`git reset --hard\` dan force-push kecuali benar-benar memahami dampaknya.\n`;
  await writeFile(join(historyDirectory, `${commit.short}.md`), document, 'utf8');
}

const head = commits[0];
const indexDocument = `# Riwayat Commit dan Panduan Rollback\n\nDokumen ini dibuat otomatis oleh \`npm run history\` dari riwayat Git yang benar-benar sudah di-commit. Setiap SHA memiliki file Markdown sendiri berisi ringkasan, daftar file, statistik, dan perintah pemulihan aman.\n\n> SHA adalah identitas commit yang sebenarnya. Pesan commit boleh sama, tetapi SHA selalu berbeda. Perubahan yang belum di-commit tidak akan muncul di sini.\n\n- Commit terbaru saat dokumen dibuat: \`${head.sha}\`\n- Jumlah commit terdokumentasi: ${commits.length}\n- Generator: \`scripts/update-commit-history.mjs\`\n\n## Daftar commit\n\n| SHA | Tanggal | Isi perubahan | File |\n| --- | --- | --- | ---: |\n${indexRows.join('\n')}\n\n## Alur yang disarankan\n\n1. Jalankan \`npm.cmd run validate\`. Perintah ini otomatis memperbarui folder riwayat.\n2. Periksa file commit yang menjadi target rollback.\n3. Gunakan \`git switch --detach <SHA>\` jika hanya ingin melihat versi lama.\n4. Gunakan \`git restore --source=<SHA> --staged --worktree .\` lalu buat commit baru jika ingin memulihkan project tanpa menulis ulang history.\n5. Validasi dan deploy ulang setelah rollback.\n\n## Catatan tentang commit terbaru\n\nSebuah commit tidak dapat menyimpan SHA miliknya sendiri karena SHA dihitung dari isi commit tersebut. Karena itu, commit yang baru dibuat akan masuk ke dokumentasi saat \`npm run history\` atau \`npm run validate\` dijalankan pada perubahan berikutnya. Riwayat Git tetap lengkap; generator dapat dijalankan kapan saja untuk menampilkan HEAD terbaru di working tree.\n`;
await writeFile(join(historyDirectory, 'README.md'), indexDocument, 'utf8');

console.log(`Riwayat commit diperbarui: ${commits.length} SHA di ${historyDirectory}`);
