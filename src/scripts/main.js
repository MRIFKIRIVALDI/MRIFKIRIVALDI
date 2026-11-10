import { createGalaxyController } from './galaxy.js';
import { renderContent } from './render.js';
import { initTheme } from './theme.js';

renderContent();

const galaxy = createGalaxyController();
initTheme((isGalaxy) => galaxy.setActive(isGalaxy));

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const menuButton = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');

function setMenu(open) {
  navigation?.classList.toggle('is-open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  const menuIcon = menuButton?.querySelector('i');
  if (menuIcon) menuIcon.className = `fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`;
}

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#contact-name').value.trim();
  const email = document.querySelector('#contact-email').value.trim();
  const service = document.querySelector('#contact-service').value;
  const message = document.querySelector('#contact-message').value.trim();
  const subject = encodeURIComponent(`Project Inquiry — ${service}`);
  const body = encodeURIComponent(`Halo Rifki,\n\nNama: ${name}\nEmail: ${email}\nLayanan: ${service}\n\n${message}`);
  window.location.href = `mailto:rifki200804@gmail.com?subject=${subject}&body=${body}`;
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => observer.observe(item));
  window.setTimeout(() => revealItems.forEach((item) => item.classList.add('is-visible')), 1200);
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
