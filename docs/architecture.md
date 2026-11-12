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
                            dist/
                              |
                       OpenAI Sites hosting
```

Folder `docs/` tidak disalin ke `dist`, sehingga backup, referensi desain, dan aset master tidak menambah ukuran website produksi.
