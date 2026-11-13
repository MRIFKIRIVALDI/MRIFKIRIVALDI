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
- Background light menggunakan `src/assets/images/wellpaper/welllightmode.gif`, sedangkan Galaxy mode menggunakan `welldarkmode.gif` sebagai layer fixed di belakang atmosfer dan panel kaca.
- Hero light menggunakan `src/assets/images/3d_object/pesawat3d.glb`; Galaxy mode memuat `astronot3d.glb` secara lazy. Keduanya memakai idle motion dan drag-to-rotate dengan inertia. Klik pesawat menjalankan animasi approach/impact lalu membuka section About; klik astronot menjalankan ayunan tubuh dan trail alat. Astronot mendapat rig pupil tambahan karena GLB sumber hanya memiliki satu mesh tanpa node mata atau alat terpisah.
- Material glass memakai surface yang lebih transparan, specular gradient, border bercahaya tipis, serta backdrop blur 32–34 px agar wallpaper tetap terlihat tanpa mengurangi keterbacaan.

## Sumber implementasi

- Warna, radius, font, dan shadow: `src/styles/tokens.css`
- Komponen reusable: `src/styles/components.css`
- Layout section: `src/styles/sections.css`
- Komposisi About: `src/styles/about.css`
- Breakpoint: `src/styles/responsive.css`
- Robot 3D: `src/scripts/hero-robot.js`
- Navigasi utama memakai posisi fixed; sistem glass memakai surface transparan, blur tinggi, dan saturasi warna wallpaper. Bagian Technologies menyediakan pencarian serta filter IDE, Bahasa Pemrograman, Framework, Agent AI, Database, Office, Desain, dan Lainnya.
- Galaxy background: `src/scripts/galaxy.js`
