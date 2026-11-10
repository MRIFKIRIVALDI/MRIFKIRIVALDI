# Product Requirements Document (PRD): Personal 3D Portfolio

**Nama Proyek:** M. Rifki Rivaldi - Tech & IoT Specialist Portfolio
**Versi Dokumen:** 1.0
**Pemilik Proyek:** M. Rifki Rivaldi

## 1. Ringkasan Eksekutif
Proyek ini adalah pengembangan situs web portofolio interaktif tingkat lanjut yang dirancang untuk mendemonstrasikan keahlian teknis dan desain M. Rifki Rivaldi. Situs ini berfokus pada pengalaman pengguna kelas atas (*ultra-luxury*) dengan memadukan estetika *Neo-Glassmorphism* dan rendering objek 3D secara *real-time*. Portofolio ini akan berfungsi sebagai identitas digital profesional utama untuk menarik klien, perekrut, dan kolaborator di bidang *Web Development*, *IoT Engineering*, *Network Security*, serta *UI/UX Design*.

## 2. Tujuan & Sasaran
*   **Demonstrasi Visual & Teknis:** Membuktikan kompetensi *frontend* melalui implementasi sistem desain kustom "Aetheria Glass" dan interaktivitas Three.js yang kompleks.
*   **Konsolidasi Kredensial:** Menampilkan metrik pencapaian (3+ tahun aktif, 6+ proyek utama) dan 6+ sertifikasi resmi secara terpusat.
*   **Konversi Prospek:** Menyediakan jalur komunikasi yang *seamless* (mulai dari WhatsApp, email, hingga formulir kontak dinamis) guna meningkatkan peluang proyek baru.

## 3. Spesifikasi Desain & UI/UX (Aetheria Glass System)
Sistem desain "Aetheria Glass" mendefinisikan bahasa visual proyek ini yang mengedepankan kesan presisi, elegan, dan kedalaman kosmik.

*   **Gaya Visual Utama:** Pendekatan *Neo-Glassmorphism* dengan panel tembus pandang bertekstur, efek *backdrop blur* yang pekat (20px hingga 40px), dan pancaran bayangan sekitar (*ambient glow drop-shadows*).
*   **Tipografi:** 
    *   **Plus Jakarta Sans** digunakan untuk *headline* utama dan teks tubuh (*body copy*) guna memberikan lengkungan geometris yang modern. 
    *   **Space Grotesk** digunakan sebagai tipografi *monospace*.
*   **Mode Tema (Theme Modes):**
    *   **Light Mode (Luminous Frost):** Menampilkan kanvas porselen hangat yang bergeser ke *milk-violet* pucat. Menggunakan palet aksen *Electric Iris* (#6366F1), *Glacial Sky*, dan *Soft Orchid*.
    *   **Galaxy Dark Mode (Interstellar Obsidian):** Menghadirkan kanvas *navy* pekat bernuansa kosmik dengan aksen pendar *Bioluminescent Cyan* dan *Stellar Violet*.
*   **Hierarki Geometris:** Menggunakan bentuk kapsul atau pil (*stadium pills / rounded-full*) untuk tombol navigasi CTA dan metrik melayang, serta sudut *rounded-xl* (24px - 32px) pada kartu konten utama.

## 4. Kebutuhan Fungsional (Key Features)

### A. Navigasi & Sistem Tema
*   **Floating Island Header:** Menu navigasi berbentuk pil yang melayang, dilengkapi dengan pengguliran halus (*smooth scroll*) ke semua seksi konten utama.
*   **Theme Toggle Button:** Tombol interaktif untuk beralih antara *Light Mode* dan *Galaxy Dark Mode*. Saat *Galaxy Dark Mode* diaktifkan, sistem memicu elemen `<canvas>` dari Three.js untuk memuat animasi *starfield* interaktif dan partikel kosmik.

### B. Struktur Halaman Utama
*   **Hero Section:** Menampilkan pengenalan nama dan spesialisasi menggunakan teks bergradasi. Dilengkapi dengan bingkai foto profil berbentuk lengkungan kaca melengkung (*signature arched portrait glass frame*) dan elemen kartu metrik statis yang melayang (*floating micro-cards*).
*   **Infinite Marquee:** Pita teks kinetik yang bergerak tanpa batas secara horizontal, menampilkan keterampilan teknis utama dan nilai-nilai desain profesional.
*   **Services & Tools:** Penjabaran 4 pilar layanan utama (Web, IoT, Infrastruktur Jaringan, dan Visual) dalam format ubin kaca (*glass-tiles*), serta *grid* 8 kolom untuk menampilkan tumpukan teknologi perangkat lunak dan perangkat keras.
*   **Selected Work (Portofolio):** *Grid* kartu proyek kelas atas yang memuat 6 studi kasus utama, antara lain Go Pesantren, Sistem Parkir Otomatis IoT, dan AppSheet Packing Record. Setiap kartu berisi indikator panah sudut interaktif.
*   **Workflow Process:** Lintasan proses berurutan 5 tahap (Discover, Define, Prototype, Develop, Deploy & Test) untuk menegaskan metodologi pengembangan yang terstruktur.
*   **Sertifikasi:** Sistem kisi untuk menampilkan kualifikasi resmi berskala nasional dan internasional (Python, Cisco, AWS, Oracle, Kominfo).

### C. Modul Interaksi
*   **Dynamic Contact Form:** Formulir dengan elemen *glass inset inputs* transparan yang memetakan masukan dari nama, email, layanan yang diminati, dan pesan secara otomatis menjadi protokol rute URL `mailto:` saat dikirimkan.
*   **Mouse Tracking 3D:** Latar belakang bintang (Three.js) melacak pergerakan *mouse* kursor pengunjung (*X/Y axis parallax*) guna menciptakan efek kedalaman ruang kosmik yang dinamis.

## 5. Tumpukan Teknologi (Tech Stack)

*   **Frontend Framework & Styling:** 
    *   HTML5 untuk kerangka semantik struktural.
    *   Tailwind CSS (memanfaatkan *plugin* `forms` dan `container-queries`) sebagai utilitas penataan gaya utama yang responsif.
    *   CSS murni untuk animasi kompleks, rotasi, transisi cahaya kaca, dan filter *backdrop* tembus pandang.
*   **3D Graphics & Visuals:** Library Three.js (`r128`) untuk merender *buffer geometry*, partikel debu, matriks kamera, dan sinkronisasi performa pada latar belakang kanvas.
*   **Ikonografi & Aset:** FontAwesome 6 Pro untuk *glyph* dan ikonografi sistem operasional terintegrasi.

## 6. Persyaratan Non-Fungsional (Performance & UX)
*   **Responsivitas Perangkat:** Sistem mengadopsi struktur berbasis *fluid grid* 12 kolom untuk *desktop*, 8 kolom untuk *tablet*, dan 4 kolom untuk *mobile* guna menjaga konsistensi proporsi elemen.
*   **Performa Render:** Animasi kanvas Three.js diimplementasikan dengan pengaturan *alpha* aktif, *antialias*, dan preferensi daya performa tinggi (*high-performance*) menggunakan fungsi `requestAnimationFrame` yang hanya berjalan jika layar sedang dalam tampilan *Galaxy Mode* untuk menghemat sumber daya sistem.
*   **Adaptasi Penyimpanan Status Tema:** Status preferensi tampilan gelap/terang pengguna akan disimpan dalam penyimpanan *browser* (`localStorage: site-theme`) guna mencegah perpindahan desain yang tidak diinginkan pada sesi navigasi berikutnya.