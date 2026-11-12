# Portofolio M. Rifki Rivaldi

Portofolio statis berbasis HTML, CSS modular, JavaScript ES Modules, dan Three.js. Proyek sengaja tidak memakai framework karena seluruh konten masih berupa satu halaman tanpa state aplikasi, routing, autentikasi, atau backend.

## Perintah utama

```powershell
npm.cmd run check     # Cek sintaks, aset, CSS import, id, anchor, dan hosting config
npm.cmd run build     # Buat output deployment di dist/
npm.cmd run dev       # Build lalu jalankan preview di http://127.0.0.1:4173
npm.cmd run validate  # Jalankan check dan build sekaligus
```

Tidak ada package eksternal yang perlu di-install. `package.json` hanya menyediakan perintah kerja yang konsisten.

## Struktur folder

```text
.
├── .openai/
│   └── hosting.json             # Identitas dan output hosting Sites
├── docs/
│   ├── architecture.md          # Arsitektur dan arah dependensi
│   ├── product-requirements.md  # PRD proyek
│   ├── design-reference/        # Referensi desain, bukan source produksi
│   ├── source-assets/           # Aset master yang tidak ikut deployment
│   └── archive/                 # Snapshot lama yang hanya untuk referensi
├── scripts/
│   ├── build.mjs                # Menyusun dist/ dari source aktif
│   ├── check.mjs                # Pemeriksaan otomatis tanpa dependency
│   └── dev.mjs                  # Static preview server lokal
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
├── package.json                 # Perintah kerja proyek
└── dist/                        # Hasil build; jangan diedit langsung
```

## Panduan revisi cepat

- Ubah proyek, layanan, sertifikat, teknologi, dan social link di `src/data/content.js`.
- Ubah isi unik Hero, About, Contact, atau navbar di `index.html`.
- Ubah warna dan ukuran global di `src/styles/tokens.css`.
- Ubah layout umum section di `src/styles/sections.css`.
- Ubah komposisi About di `src/styles/about.css`.
- Ubah breakpoint tablet/mobile di `src/styles/responsive.css`.
- Ganti gambar di `src/assets/images/`, lalu sesuaikan path di `content.js` atau `index.html`.
- Jangan mengedit `dist/`; jalankan `npm.cmd run build` untuk membuatnya ulang.

## Kapan perlu framework?

Belum perlu. Framework seperti React/Vue baru layak dipertimbangkan jika proyek berkembang menjadi banyak halaman, mempunyai state kompleks, mengambil data dari API/backend, memerlukan autentikasi, atau memiliki komponen interaktif yang dipakai ulang dalam jumlah besar. Untuk portofolio ini, ES Modules lebih ringan dan lebih mudah dipelihara.
