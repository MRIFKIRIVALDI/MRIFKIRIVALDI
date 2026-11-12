# Sistem Desain Aetheria Glass

Dokumen ini adalah ringkasan aturan visual yang dipertahankan setelah prototipe desain lama dibersihkan. Nilai implementasi yang menjadi sumber kebenaran berada di `src/styles/tokens.css` dan stylesheet modular lainnya.

## Identitas visual

- Neo-glassmorphism dengan panel transparan, blur 20–40 px, border tipis, dan ambient glow.
- Light mode memakai porcelain/milk-violet, Electric Iris, cyan, dan orchid.
- Galaxy mode memakai navy `#070913`, permukaan kaca gelap, cyan `#38bdf8`, serta violet `#c084fc`.
- Plus Jakarta Sans untuk teks utama dan Space Grotesk untuk aksen teknis.
- Tombol dan kontrol memakai bentuk pill; kartu utama memakai radius 24–34 px.

## Tata letak

- Lebar konten aktif dibatasi token `--page-width` dan spacing section bersifat fluid.
- Desktop memakai komposisi multi-kolom; tablet dan mobile diatur di `responsive.css`.
- Hero mempertahankan tiga area horizontal di desktop: identitas, robot astronot Three.js, dan ringkasan/CTA.
- Navbar, About, Services, Projects, Process, Certificates, dan Contact mempertahankan hierarki serta interaksi yang ada.

## Kedalaman dan interaksi

- Latar atmosfer berada di layer dasar; panel kaca di atasnya; badge dan kontrol menjadi layer paling tinggi.
- Hover boleh menggeser elemen beberapa piksel dan memperkuat glow tanpa mengubah struktur layout.
- Galaxy starfield dan robot astronot dirender dengan Three.js, mendukung gerak pointer dan `prefers-reduced-motion`.
- Status tema disimpan pada `localStorage` dengan key `site-theme`.

## Sumber implementasi

- Warna, radius, font, dan shadow: `src/styles/tokens.css`
- Komponen reusable: `src/styles/components.css`
- Layout section: `src/styles/sections.css`
- Komposisi About: `src/styles/about.css`
- Breakpoint: `src/styles/responsive.css`
- Robot 3D: `src/scripts/hero-robot.js`
- Galaxy background: `src/scripts/galaxy.js`
