import {
  certificates,
  processSteps,
  projects,
  services,
  skillMarquee,
  socialLinks,
  toolCategories,
  tools,
  valueMarquee,
} from '../data/content.js';

const setHTML = (selector, markup) => {
  const element = document.querySelector(selector);
  if (element) element.innerHTML = markup;
};

const icon = (className) => `<i class="${className}" aria-hidden="true"></i>`;
const assetImage = (source, alt, className = '') => `<img class="${className}" src="${source}" alt="${alt}" loading="lazy" decoding="async" />`;
const toolImage = (source, alt, className) => `<img class="${className}" src="${source}" alt="${alt}" decoding="async" />`;

export function renderContent() {
  setHTML('#social-links', socialLinks.map((item) => `
    <a href="${item.url}" target="_blank" rel="noreferrer" aria-label="${item.label}">
      ${item.image ? assetImage(item.image, '', 'social-links__icon') : icon(item.icon)}<span>${item.label}</span>
    </a>
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

  setHTML('[data-tools-filters]', toolCategories.map((category) => `
    <button
      class="tools-filter glass-control${category.id === 'all' ? ' is-active' : ''}"
      type="button"
      data-tool-filter="${category.id}"
      aria-pressed="${category.id === 'all'}"
    >
      ${category.label}
      <span>${category.id === 'all' ? tools.length : tools.filter((item) => item.category === category.id).length}</span>
    </button>
  `).join(''));

  setHTML('#tools-grid', tools.map((item) => `
    <a
      class="tool-card glass-tile accent-${item.accent}"
      href="${item.url}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Buka website ${item.name}"
      data-tool-card
      data-tool-name="${item.name.toLocaleLowerCase('id-ID')}"
      data-tool-category="${item.category}"
    >
      <span class="tool-card__logo-wrap">
        ${toolImage(item.image, `Logo ${item.name}`, item.darkImage ? 'tool-card__logo tool-card__logo--light' : 'tool-card__logo')}
        ${item.darkImage ? toolImage(item.darkImage, '', 'tool-card__logo tool-card__logo--dark') : ''}
      </span>
      <span class="tool-card__name">${item.name}</span>
      ${icon('fa-solid fa-arrow-up-right-from-square tool-card__external')}
    </a>
  `).join(''));

  initToolsBrowser();

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

function initToolsBrowser() {
  const search = document.querySelector('[data-tools-search]');
  const filters = [...document.querySelectorAll('[data-tool-filter]')];
  const cards = [...document.querySelectorAll('[data-tool-card]')];
  const result = document.querySelector('[data-tools-result]');
  const empty = document.querySelector('[data-tools-empty]');
  let activeCategory = 'all';

  const applyFilters = () => {
    const query = search?.value.trim().toLocaleLowerCase('id-ID') || '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory = activeCategory === 'all' || card.dataset.toolCategory === activeCategory;
      const matchesSearch = !query || card.dataset.toolName.includes(query);
      const visible = matchesCategory && matchesSearch;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (result) result.textContent = `${visibleCount} teknologi ditampilkan`;
    if (empty) empty.hidden = visibleCount !== 0;
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.toolFilter;
      filters.forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    });
  });

  search?.addEventListener('input', applyFilters);
  applyFilters();
}

function renderMarquee(selector, items, separatorIcon) {
  const group = items.map((item) => `<span>${item}${icon(separatorIcon)}</span>`).join('');
  setHTML(selector, `<div class="marquee__group">${group}</div><div class="marquee__group" aria-hidden="true">${group}</div>`);
}
