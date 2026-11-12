# Laporan Audit dan Perapihan Project

**Tanggal audit:** 12 November 2026  
**Ruang lingkup:** seluruh source, aset, dokumentasi, konfigurasi, output build, dan output QA.

## Ringkasan hasil

- Source resmi hanya menggunakan satu folder `src/` dan satu entry point `index.html` di root.
- Seluruh 27 aset produksi di `src/assets/` masih digunakan; tidak ada aset runtime yang dihapus.
- Tiga kelompok arsip/prototipe lama sudah dibandingkan sebelum dihapus.
- `dist/` hanya dibuat sementara untuk build/hosting, diabaikan Git, dan dibersihkan kembali agar tidak terlihat sebagai source ganda.
- Tidak diperlukan framework baru. HTML, CSS modular, ES Modules, dan Three.js sudah cukup untuk satu halaman tanpa routing, autentikasi, backend, atau state aplikasi kompleks.

## Duplikasi yang ditemukan dan keputusan

| Kelompok | Hasil pembandingan | Keputusan |
| --- | --- | --- |
| `index.html` aktif dan `docs/archive/.../index.before-about-reference.html` | Versi aktif lebih baru: memiliki favicon, About terbaru, foto `rifki-about.png`, huruf latar `R`, serta path aset terpusat. Arsip masih menunjuk ke `./images/...` yang tidak ada. | Pertahankan root `index.html`; hapus snapshot. |
| `src/styles/main.css` dan `docs/archive/.../main.before-about-reference.css` | Versi aktif mengimpor enam modul termasuk `about.css`; arsip hanya lima dan tidak memuat komposisi About terbaru. | Pertahankan versi `src`; hapus snapshot. |
| `docs/design-reference/.../code.html` dan snapshot Stitch | Keduanya prototipe standalone berbasis Tailwind CDN dengan CSS/JS inline. Tidak diimpor oleh source aktif dan berbeda arsitektur dari CSS modular/ES Modules produksi. | Simpan aturan visual relevan di `docs/design-system.md`; hapus dua prototipe. |
| Screenshot referensi desain | Hanya input visual historis dan tidak direferensikan runtime. | Hapus setelah identitas visual diringkas di `docs/design-system.md`. |
| Tiga foto profil | File sumber JPG 2976×3968, PNG lama 341×512, dan PNG aktif 738×1107 memiliki hash berbeda. Hanya PNG aktif yang direferensikan; resolusinya lebih tinggi daripada PNG lama dan sesuai komposisi About saat ini. | Pertahankan `src/assets/images/profile/rifki-about.png`; hapus dua sumber yang tidak dipakai. |
| `src/`/`index.html` dan salinannya di `dist/` | Seluruh 41 file build memiliki hash identik dengan input yang disalin. Salinan ini dibuat otomatis oleh `scripts/build.mjs` dan hanya wajib tersedia ketika packaging berlangsung. | Jadikan `dist/` artefak sementara; hapus otomatis setelah validasi/preview dan setelah deployment. |
| `outputs/` | Berisi profil browser, screenshot QA, dan paket publikasi lama; bukan source atau dependensi runtime. | Bersihkan setelah pengujian dan publikasi selesai. |

## File yang dipertahankan

- `index.html`: satu-satunya source entry point dan struktur semantik halaman.
- `src/data/content.js`: sumber tunggal konten berulang dan link.
- `src/scripts/`: modul render, tema, galaxy, robot astronot, dan orkestrasi UI.
- `src/styles/`: stylesheet modular berdasarkan tanggung jawab.
- `src/assets/`: 27 aset produksi yang seluruhnya terdeteksi masih direferensikan.
- `scripts/`: build, validasi, dan preview tanpa dependency eksternal.
- `.openai/hosting.json`: mengarahkan hosting statis ke `dist/`.
- `docs/product-requirements.md`, `docs/architecture.md`, dan `docs/design-system.md`: persyaratan, arah dependensi, dan guardrail visual.

## File dan folder yang dihapus

- `docs/archive/2026-11-11/` — 3 snapshot source lama, 91.879 byte.
- `docs/design-reference/` — 2 prototipe/screenshot dan satu dokumen desain lama, total 4 file, 1.331.886 byte.
- `docs/source-assets/` — 2 varian foto yang tidak direferensikan, 3.562.158 byte.
- `outputs/` — artefak QA dan paket publikasi sementara; dibersihkan setelah seluruh verifikasi selesai.

## Referensi path dan konfigurasi

- Path produksi menggunakan `./src/styles/...`, `./src/scripts/...`, dan `./assets/...` pada HTML hasil build.
- Source aset tunggal berada di `src/assets/`; build menyalinnya ke `dist/assets/` agar URL runtime tetap ringkas.
- Tidak ada referensi aktif ke `docs/archive`, `docs/design-reference`, `docs/source-assets`, atau folder `images` lama.
- `package.json` tetap minimal dan tidak membutuhkan instalasi package.
- `scripts/check.mjs` diperkuat untuk memeriksa satu source `index.html`, satu folder `src`, path pensiun, aset yang tidak digunakan, sintaks JavaScript, import CSS, anchor, ID, dan konfigurasi hosting.

## Struktur akhir

```text
.
├── .openai/
│   └── hosting.json
├── docs/
│   ├── architecture.md
│   ├── audit-report.md
│   ├── design-system.md
│   └── product-requirements.md
├── scripts/
│   ├── build.mjs
│   ├── check.mjs
│   └── dev.mjs
├── src/
│   ├── assets/
│   │   ├── favicon.svg
│   │   └── images/{certificates,icons,profile,projects}/
│   ├── data/content.js
│   ├── scripts/{galaxy,hero-robot,main,render,theme}.js
│   └── styles/{about,base,components,main,responsive,sections,tokens}.css
├── index.html
├── package.json
```

Saat build atau deployment berlangsung, `dist/` muncul sementara sebagai artefak generated dan bukan bagian dari struktur source akhir.

## Hasil pengujian

- `npm.cmd run check`: lulus — 10 file JavaScript, 29 referensi lokal, 32 ID HTML, satu source index, satu folder src, dan seluruh aset produksi diperiksa.
- `npm.cmd run validate`: lulus — pemeriksaan struktur/sintaks, build statis, dan pembersihan otomatis `dist/` selesai dengan exit code 0.
- HTTP preview: lulus dengan status 200.
- Desktop 1440×1000: lulus — 27 gambar termuat, tidak ada horizontal overflow, canvas robot aktif pada 480×570, foto About 738 px, dan huruf latar `R` terdeteksi.
- Mobile 390×844: lulus — tidak ada gambar rusak atau horizontal overflow, media query aktif, dan tombol menu tampil.
- Interaksi: lulus — toggle berpindah ke Galaxy, preferensi tersimpan, starfield aktif, dan pointer/click robot dapat dipicu.
- Console/network: lulus — 0 runtime exception, 0 console error, dan 0 network failure.

