# Portofolio M. Rifki Rivaldi

Portofolio statis berbasis HTML, CSS modular, JavaScript ES Modules, dan Three.js. Proyek sengaja tidak memakai framework karena seluruh konten masih berupa satu halaman tanpa state aplikasi, routing, autentikasi, atau backend.

## Perintah utama

```powershell
npm.cmd run check     # Cek sintaks, aset, CSS import, id, anchor, dan hosting config
npm.cmd run build     # Buat output deployment sementara di dist/
npm.cmd run clean     # Hapus output build sementara
npm.cmd run dev       # Preview source langsung tanpa membuat dist/
npm.cmd run history   # Buat/update dokumentasi Markdown untuk setiap SHA
npm.cmd run validate  # Update history, check, build, lalu bersihkan dist/
```

Tidak ada package eksternal yang perlu di-install. `package.json` hanya menyediakan perintah kerja yang konsisten.

## Struktur folder

```text
.
├── .openai/
│   └── hosting.json             # Identitas dan output hosting Sites
├── docs/
│   ├── architecture.md          # Arsitektur dan arah dependensi
│   ├── audit-report.md          # Hasil audit dan keputusan perapihan
│   ├── commit-history/           # Indeks dan detail rollback setiap SHA
│   ├── design-system.md         # Aturan visual yang wajib dipertahankan
│   └── product-requirements.md  # PRD proyek
├── scripts/
│   ├── build.mjs                # Menyusun dist/ dari source aktif
│   ├── check.mjs                # Pemeriksaan otomatis tanpa dependency
│   ├── clean.mjs                # Menghapus output build sementara
│   ├── dev.mjs                  # Static preview server lokal
│   └── update-commit-history.mjs # Generator dokumentasi setiap SHA
├── src/
│   ├── assets/images/           # Semua aset gambar yang dipakai website
│   │   ├── certificates/
│   │   ├── icons/
│   │   ├── profile/
│   │   └── projects/
│   ├── data/content.js          # Konten berulang dan link eksternal
│   ├── scripts/                 # Perilaku UI, tema, render, dan Three.js
│   └── styles/                  # CSS berdasarkan tanggung jawab
├── index.html                   # Struktur semantik halaman
└── package.json                 # Perintah kerja proyek
```

`dist/` tidak termasuk struktur source. Folder tersebut hanya dibuat sementara saat `build` atau proses deployment, lalu dibersihkan kembali agar Explorer tetap menampilkan satu `src/` dan satu `index.html`. Perintah `dev` melayani source root secara langsung.

## Panduan revisi cepat

- Ubah proyek, layanan, sertifikat, teknologi, dan social link di `src/data/content.js`.
- Logo Tools & Skills berada di `src/assets/images/logo tools/`; nama, URL, logo, dan warna kartunya diatur melalui array `tools` pada `src/data/content.js`.
- Ubah isi unik Hero, About, Contact, atau navbar di `index.html`.
- Ubah warna dan ukuran global di `src/styles/tokens.css`.
- Ubah layout umum section di `src/styles/sections.css`.
- Ubah komposisi About di `src/styles/about.css`.
- Ubah breakpoint tablet/mobile di `src/styles/responsive.css`.
- Ganti gambar di `src/assets/images/`, lalu sesuaikan path di `content.js` atau `index.html`.
- Jangan mengedit `dist/`; folder sementara ini selalu dibuat ulang dari source aktif.

## Kapan perlu framework?

Belum perlu. Framework seperti React/Vue baru layak dipertimbangkan jika proyek berkembang menjadi banyak halaman, mempunyai state kompleks, mengambil data dari API/backend, memerlukan autentikasi, atau memiliki komponen interaktif yang dipakai ulang dalam jumlah besar. Untuk portofolio ini, ES Modules lebih ringan dan lebih mudah dipelihara.
