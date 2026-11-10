# Aetheria Portfolio — M. Rifki Rivaldi

Implementasi portofolio berdasarkan `product_requirements_document.md` dan referensi `stitch_glassmorphic_3d_developer_portfolio/DESIGN.md`.

## Menjalankan proyek

Proyek ini tidak membutuhkan instalasi package. Jalankan static server dari folder proyek:

```powershell
python -m http.server 8000
```

Kemudian buka `http://localhost:8000`.

Untuk menghasilkan artefak deployment di folder `dist`:

```powershell
node scripts/build.mjs
```

## Struktur yang perlu diketahui

```text
.
├── index.html                  # Struktur halaman dan konten unik
├── scripts/build.mjs           # Build statis ke folder dist
├── src/
│   ├── data/
│   │   └── content.js          # Data layanan, tools, proyek, proses, sertifikat
│   ├── assets/
│   │   └── profile-rifki.png   # Foto profil lokal
│   ├── scripts/
│   │   ├── main.js             # Bootstrap, navigasi, form, reveal animation
│   │   ├── render.js           # Template komponen berbasis data
│   │   ├── theme.js            # Light/Galaxy theme + localStorage
│   │   └── galaxy.js           # Three.js starfield + mouse parallax
│   └── styles/
│       ├── main.css            # Entry CSS
│       ├── tokens.css          # Warna, tipografi, radius, spacing
│       ├── base.css            # Reset dan fondasi global
│       ├── components.css      # Glass, tombol, marquee, atmosfer
│       ├── sections.css        # Layout setiap section
│       └── responsive.css      # Tablet dan mobile
├── product_requirements_document.md
└── stitch_glassmorphic_3d_developer_portfolio/ # Referensi desain asli
```

## Panduan revisi cepat

- Ubah proyek, layanan, teknologi, proses, sertifikat, atau link sosial di `src/data/content.js`.
- Ubah palet dan skala desain di `src/styles/tokens.css`.
- Ubah layout section di `src/styles/sections.css`.
- Ubah email tujuan pada handler formulir di `src/scripts/main.js`.
- Ganti `src/assets/profile-rifki.png` untuk memperbarui foto tanpa mengubah markup.

Theme tersimpan dengan key `site-theme`. Animasi Three.js hanya berjalan saat Galaxy Mode aktif dan otomatis berhenti saat pengguna memilih reduced motion.
