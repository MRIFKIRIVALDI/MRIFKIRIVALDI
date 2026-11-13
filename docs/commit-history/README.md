# Riwayat Commit dan Panduan Rollback

Dokumen ini dibuat otomatis oleh `npm run history` dari riwayat Git yang benar-benar sudah di-commit. Setiap SHA memiliki file Markdown sendiri berisi ringkasan, daftar file, statistik, dan perintah pemulihan aman.

> SHA adalah identitas commit yang sebenarnya. Pesan commit boleh sama, tetapi SHA selalu berbeda. Perubahan yang belum di-commit tidak akan muncul di sini.

- Commit terbaru saat dokumen dibuat: `e241640eff06051df04d05f95fd56582904ab93a`
- Jumlah commit terdokumentasi: 12
- Generator: `scripts/update-commit-history.mjs`

## Daftar commit

| SHA | Tanggal | Isi perubahan | File |
| --- | --- | --- | ---: |
| [`e241640`](./e241640.md) | 2026-11-13 | feat: add animated theme wallpapers and premium glass | 10 |
| [`cffaa41`](./cffaa41.md) | 2026-11-12 | docs: add SHA-based rollback history | 15 |
| [`d99804c`](./d99804c.md) | 2026-11-12 | Menambahkan Microsoft Word, Excel, PowerPoint, dan Canva sehingga Tools & Skills berisi 34 kartu. | 3 |
| [`871172f`](./871172f.md) | 2026-11-12 | Menambahkan 30 kartu Tools & Skills dengan 31 logo, link eksternal, responsivitas, dan varian logo GPT untuk kedua tema. | 41 |
| [`59da806`](./59da806.md) | 2026-11-12 | Memperbaiki seluruh path gambar ke src/assets agar gambar tampil dari root preview maupun deployment. | 8 |
| [`ce30e5b`](./ce30e5b.md) | 2026-11-12 | Menjadikan dist sebagai output sementara, menambahkan clean script, dan menjaga root hanya memiliki satu src serta satu index.html. | 7 |
| [`fa0ee91`](./fa0ee91.md) | 2026-11-12 | Melakukan audit menyeluruh, menghapus snapshot dan aset duplikat, serta menambahkan laporan audit dan sistem desain. | 14 |
| [`c81f906`](./c81f906.md) | 2026-11-12 | Memperbaiki foto About Me beresolusi tinggi, mengganti huruf latar menjadi R, dan memperbaiki pesan error preview. | 4 |
| [`8487712`](./8487712.md) | 2026-11-12 | Merombak struktur project menjadi satu src, memindahkan aset ke folder semantik, dan menambahkan build, check, dev, serta dokumentasi arsitektur. | 52 |
| [`71ea21b`](./71ea21b.md) | 2026-11-11 | Mengintegrasikan foto profil, ikon sosial, gambar proyek, sertifikat, serta menyempurnakan robot dan konten portofolio. | 33 |
| [`6b8bfe3`](./6b8bfe3.md) | 2026-11-11 | Mengubah Hero menjadi layout tiga bagian dan menambahkan robot astronot interaktif berbasis Three.js. | 6 |
| [`fbf37b6`](./fbf37b6.md) | 2026-11-10 | Membuat versi awal portofolio Aetheria Glass beserta struktur HTML, CSS modular, JavaScript, PRD, dan konfigurasi hosting. | 21 |

## Alur yang disarankan

1. Jalankan `npm.cmd run validate`. Perintah ini otomatis memperbarui folder riwayat.
2. Periksa file commit yang menjadi target rollback.
3. Gunakan `git switch --detach <SHA>` jika hanya ingin melihat versi lama.
4. Gunakan `git restore --source=<SHA> --staged --worktree .` lalu buat commit baru jika ingin memulihkan project tanpa menulis ulang history.
5. Validasi dan deploy ulang setelah rollback.

## Catatan tentang commit terbaru

Sebuah commit tidak dapat menyimpan SHA miliknya sendiri karena SHA dihitung dari isi commit tersebut. Karena itu, commit yang baru dibuat akan masuk ke dokumentasi saat `npm run history` atau `npm run validate` dijalankan pada perubahan berikutnya. Riwayat Git tetap lengkap; generator dapat dijalankan kapan saja untuk menampilkan HEAD terbaru di working tree.
