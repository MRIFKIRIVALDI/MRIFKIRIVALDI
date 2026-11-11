import {
  certificates,
  processSteps,
  projects,
  services,
  skillMarquee,
  socialLinks,
  stats,
  tools,
  valueMarquee,
} from '../data/content.js';

const setHTML = (selector, markup) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = markup;
};

const icon = (className) => `<i class="${className}" aria-hidden="true"></i>`;
const assetImage = (source, alt, className = '') => `<img class="${className}" src="${source}" alt="${alt}" loading="lazy" decoding="async" />`;

export function renderContent() {
  setHTML('#social-links', socialLinks.map((item) => `
    <a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${item.label}">
      ${item.image ? assetImage(item.image, '', 'social-links__icon') : icon(item.icon)}<span>${item.label}</span>
    </a>
  `).join(''));

  setHTML('#stats-grid', stats.map((item) => `
    <article class="stat-card glass-tile accent-${item.accent}">
      ${icon(item.icon)}<strong>${item.value}</strong><span>${item.label}</span>
    </article>
  `).join(''));

  setHTML('#services-grid', services.map((item) => `
    <article class="service-card glass-tile accent-${item.accent}">
      <div>
        <span class="card-icon">${icon(item.icon)}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <div class="card-footer"><span>${item.footer}</span>${icon('fa-solid fa-arrow-up-right-from-square')}</div>
    </article>
  `).join(''));

  setHTML('#tools-grid', tools.map((item) => `
    <article class="tool-card glass-tile accent-${item.accent}">
      ${icon(item.icon)}<span>${item.name}</span>
    </article>
  `).join(''));

  setHTML('#projects-grid', projects.map((item, index) => `
    <article class="project-card glass-tile accent-${item.accent}">
      <div class="project-card__body">
        <div class="project-card__visual">
          <div class="project-card__media project-card__media--${Math.min(item.images?.length || 0, 3)}">
            ${(item.images || []).map((source, imageIndex) => assetImage(source, `Tampilan ${item.title} ${imageIndex + 1}`)).join('')}
          </div>
          <span>${item.badge}</span>
        </div>
        <div class="project-card__meta"><span>${item.category}</span><small>${String(index + 1).padStart(2, '0')}</small></div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
      <div class="project-card__footer">
        <span>${item.stack}</span>
        <a class="round-link glass-control" href="${item.url}" target="_blank" rel="noreferrer" aria-label="Buka proyek ${item.title}">
          ${icon('fa-solid fa-arrow-up-right-from-square')}
        </a>
      </div>
    </article>
  `).join(''));

  setHTML('#process-grid', processSteps.map((item, index) => `
    <article class="process-card glass-tile accent-${item.accent}">
      <div>${icon(item.icon)}<span>${String(index + 1).padStart(2, '0')}</span></div>
      <h3>${item.title}</h3><p>${item.description}</p>
    </article>
  `).join(''));

  setHTML('#certificates-grid', certificates.map((item) => `
    <article class="certificate-card glass-tile accent-${item.accent}">
      <a class="certificate-card__preview" href="${item.image}" target="_blank" rel="noreferrer" aria-label="Lihat sertifikat ${item.title}">
        ${assetImage(item.image, `Sertifikat ${item.title}`)}
      </a>
      <div><small>${item.issuer}</small><h3>${item.title}</h3><p>${item.detail}</p></div>
    </article>
  `).join(''));

  renderMarquee('#skills-marquee', skillMarquee, 'fa-solid fa-star-of-life');
  renderMarquee('#values-marquee', valueMarquee, 'fa-solid fa-diamond');
}

function renderMarquee(selector, items, separatorIcon) {
  const group = items.map((item) => `<span>${item}${icon(separatorIcon)}</span>`).join('');
  setHTML(selector, `<div class="marquee__group">${group}</div><div class="marquee__group" aria-hidden="true">${group}</div>`);
}
