export const socialLinks = [
  { label: 'GitHub', image: './assets/images/icons/github.png', url: 'https://github.com/MRIFKIRIVALDI' },
  { label: 'LinkedIn', image: './assets/images/icons/linkedin.png', url: 'https://www.linkedin.com/in/m-rifki-rivaldi-091b49390/' },
  { label: 'Instagram', image: './assets/images/icons/instagram.png', url: 'https://www.instagram.com/rifkiikrif/' },
  { label: 'WhatsApp', image: './assets/images/icons/whatsapp.png', url: 'https://wa.me/6281296876716' },
];

export const services = [
  {
    title: 'Web Development',
    description: 'Aplikasi web responsif dan scalable menggunakan HTML5, CSS3, JavaScript, React, Tailwind CSS, dan Three.js.',
    footer: 'Explore Tech',
    icon: 'fa-solid fa-code',
    accent: 'amber',
  },
  {
    title: 'IoT Engineering',
    description: 'Integrasi hardware, Arduino, ESP32, telemetri sensor, RFID, dan pipeline otomasi pintar.',
    footer: 'Hardware & AIoT',
    icon: 'fa-solid fa-microchip',
    accent: 'violet',
  },
  {
    title: 'Network & Security',
    description: 'Topologi jaringan, konfigurasi Cisco, protokol firewall, troubleshooting, dan analisis cyber defense.',
    footer: 'Infrastructure',
    icon: 'fa-solid fa-network-wired',
    accent: 'cyan',
  },
  {
    title: 'Design & Digital Media',
    description: 'UI, identitas visual, materi kampanye sosial, dan desain vektor dengan Figma, CorelDraw, serta Photoshop.',
    footer: 'Visual Solutions',
    icon: 'fa-solid fa-palette',
    accent: 'rose',
  },
];

export const tools = [
  { name: 'Figma', icon: 'fa-brands fa-figma', accent: 'violet' },
  { name: 'React.js', icon: 'fa-brands fa-react', accent: 'cyan' },
  { name: 'JavaScript', icon: 'fa-brands fa-js', accent: 'amber' },
  { name: 'Python', icon: 'fa-brands fa-python', accent: 'blue' },
  { name: 'Three.js', icon: 'fa-solid fa-cube', accent: 'iris' },
  { name: 'Arduino', icon: 'fa-solid fa-microchip', accent: 'teal' },
  { name: 'Cisco', icon: 'fa-solid fa-server', accent: 'cyan' },
  { name: 'AppSheet', icon: 'fa-solid fa-table-cells', accent: 'emerald' },
];

export const projects = [
  {
    title: 'Feed IG KKN Desa Cikadu',
    category: 'Graphic Design',
    badge: 'KKN Desa Cikadu 2025',
    description: 'Publikasi visual Instagram selama satu bulan menggunakan CorelDraw dan Canva dengan sistem desain yang konsisten.',
    stack: 'CorelDraw • Canva',
    images: ['./assets/images/projects/kkn-feed-01.jpg', './assets/images/projects/kkn-feed-02.jpg', './assets/images/projects/kkn-feed-03.jpg'],
    accent: 'rose',
    url: 'https://www.instagram.com/kkn.cikadu2025/',
  },
  {
    title: 'Go Pesantren',
    category: 'Web & AI Search',
    badge: 'Gemini AI Search API',
    description: 'Website rekomendasi pesantren Indonesia dengan Python dan integrasi Gemini API untuk pencarian berbasis AI.',
    stack: 'Python • Gemini API',
    images: ['./assets/images/projects/go-pesantren.png'],
    accent: 'iris',
    url: 'https://youtu.be/WiSeUj2SIU8?si=O1fh90BGxziF_1Xj',
  },
  {
    title: 'Personal 3D Portfolio',
    category: 'Interactive 3D Web',
    badge: '3D Interactive Canvas',
    description: 'Portofolio responsif dengan wireframe 3D, kinetic fluid, dan interaksi real-time berbasis Three.js.',
    stack: 'Three.js • JavaScript',
    images: ['./assets/images/projects/portfolio-3d-01.png', './assets/images/projects/portfolio-3d-02.png'],
    accent: 'cyan',
    url: 'https://portofolio-murex-kappa-70.vercel.app/',
  },
  {
    title: 'Harris Electronic',
    category: 'Company Profile',
    badge: 'E-Commerce Profile',
    description: 'Company profile yang menyajikan katalog produk, layanan, dan kredibilitas bisnis secara komprehensif.',
    stack: 'Responsive • Catalog',
    images: ['./assets/images/projects/harris-electronic.png'],
    accent: 'emerald',
    url: 'https://www.harriselectronic.store/',
  },
  {
    title: 'Sistem Parkir Otomatis',
    category: 'IoT Hardware',
    badge: 'RFID + Ultrasonic Sensor',
    description: 'Sistem parkir IoT dengan sensor ultrasonik dan RFID untuk mengoptimalkan akses kendaraan.',
    stack: 'Arduino • Sensor • RFID',
    images: ['./assets/images/projects/parking-system.png'],
    accent: 'amber',
    url: 'https://drive.google.com/file/d/1qJvBsqJtzNZjszEt8CjiS61SxQkUjxwg/view?usp=drive_link',
  },
  {
    title: 'AppSheet Packing Record',
    category: 'Operations & Data',
    badge: 'Google AppSheet Database',
    description: 'Aplikasi pencatatan packing untuk alur verifikasi barang yang cepat, akurat, dan terstruktur.',
    stack: 'AppSheet • Spreadsheet',
    images: ['./assets/images/projects/packing-record-01.jpeg', './assets/images/projects/packing-record-02.jpeg'],
    accent: 'violet',
    url: 'https://drive.google.com/file/d/1tDL0UeVOy1pNhHrBCh2eJ0foue_NCEwn/view?usp=sharing',
  },
];

export const processSteps = [
  { title: 'Discover', description: 'Analisis kebutuhan fungsional dan observasi kendala sistem.', icon: 'fa-solid fa-compass', accent: 'iris' },
  { title: 'Define', description: 'Arsitektur sistem, skema database, dan alur telemetri hardware.', icon: 'fa-solid fa-sitemap', accent: 'violet' },
  { title: 'Prototype', description: 'Wireframe antarmuka dan pengujian skema sirkuit prototipe.', icon: 'fa-solid fa-pen-ruler', accent: 'rose' },
  { title: 'Develop', description: 'Kode efisien, wiring IoT, dan integrasi API.', icon: 'fa-solid fa-code', accent: 'cyan' },
  { title: 'Deploy & Test', description: 'Quality testing, optimasi performa, dan peluncuran produk.', icon: 'fa-solid fa-rocket', accent: 'emerald' },
];

export const certificates = [
  { issuer: 'IT Specialist', title: 'Python Certified', detail: 'Information Technology Specialist', image: './assets/images/certificates/its-python-2024.jpg', accent: 'blue' },
  { issuer: 'Komdigi DTS 2025', title: 'VSGA — IoT Engineer', detail: 'Perekayasa Perangkat Internet of Things', image: './assets/images/certificates/komdigi-iot-engineer-2025.jpg', accent: 'iris' },
  { issuer: 'Database Foundations', title: 'Oracle Academy', detail: 'Database Foundations — ID', image: './assets/images/certificates/oracle-database-foundations-2025.jpg', accent: 'rose' },
  { issuer: 'Cloud Computing', title: 'AWS Academy', detail: 'AWS Academy Cloud Foundations', image: './assets/images/certificates/aws-cloud-foundations-2025.jpg', accent: 'amber' },
  { issuer: 'Cyber Security', title: 'Workshop TI', detail: 'Keamanan Jaringan & Cyber Defense', image: './assets/images/certificates/cybersecurity-workshop-2024.jpg', accent: 'cyan' },
  { issuer: 'AI & Hardware', title: 'Workshop TE', detail: 'AIoT & Neural Network MCU', image: './assets/images/certificates/aiot-neural-network-2025.jpg', accent: 'violet' },
  { issuer: 'SENTIMETER 2024', title: 'AI-Powered Cyber Defense', detail: 'Seminar Nasional Teknologi Informasi', image: './assets/images/certificates/ai-cyber-defense-seminar-2024.jpg', accent: 'cyan' },
  { issuer: 'ICITACS 2025', title: 'International Conference', detail: 'Information Technology & Advanced Computer Science', image: './assets/images/certificates/icitacs-2025.jpg', accent: 'rose' },
  { issuer: 'SISMATIK 2025', title: 'AI in Information Systems', detail: 'Enhancing Efficiency and Innovation', image: './assets/images/certificates/ai-information-systems-2025.jpg', accent: 'blue' },
];

export const skillMarquee = ['Web Development', 'IoT Engineering', 'Cloud Computing', 'Network Security', 'UI/UX Design', 'Full-Stack Solutions', 'Three.js & 3D Experiences'];
export const valueMarquee = ['Selected Work', 'Passion for Innovation', 'Precision Engineering', 'Whoever Strives Shall Succeed', "Let's Build the Future"];
