# Arsitektur Proyek

## Arah dependensi

```text
index.html
├── src/styles/main.css
│   ├── tokens.css
│   ├── base.css
│   ├── components.css
│   ├── sections.css
│   ├── about.css
│   └── responsive.css
└── src/scripts/main.js
    ├── data/content.js <- render.js
    ├── theme.js
    ├── galaxy.js
    └── hero-robot.js
```

- `index.html` hanya berisi struktur dan konten unik.
- `content.js` menjadi sumber tunggal untuk daftar berulang.
- `render.js` mengubah data menjadi kartu HTML.
- `main.js` mengorkestrasi modul dan event halaman.
- Modul Three.js terisolasi agar perubahan robot/starfield tidak memengaruhi konten lain.
- CSS mengalir dari token global menuju komponen, section, lalu breakpoint.

## Alur build

```text
index.html + src/data + src/scripts + src/styles + src/assets
                              |
                        scripts/build.mjs
                              |
                     dist/ sementara
                              |
                       OpenAI Sites hosting
```

Folder `docs/` dan `scripts/` tidak disalin ke `dist`. Hanya entry point, source runtime, dan aset produksi yang masuk ke hasil deployment.

`dist/` bukan source kedua. Folder ini diabaikan Git dan hanya dibentuk sementara oleh `npm.cmd run build` karena OpenAI Sites membutuhkan direktori statis untuk deployment. `npm.cmd run validate` serta penutupan normal server preview akan membersihkannya kembali.
