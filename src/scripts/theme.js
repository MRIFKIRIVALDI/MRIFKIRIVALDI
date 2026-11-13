const THEME_KEY = 'site-theme';

export function initTheme(onThemeChange) {
  const root = document.documentElement;
  const toggle = document.querySelector('#theme-toggle');
  const icon = toggle?.querySelector('[data-theme-icon]');
  const label = toggle?.querySelector('[data-theme-label]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const applyTheme = (theme, persist = true) => {
    const isGalaxy = theme === 'galaxy';
    root.dataset.theme = isGalaxy ? 'galaxy' : 'light';
    toggle?.setAttribute('aria-pressed', String(isGalaxy));
    toggle?.setAttribute('aria-label', isGalaxy ? 'Aktifkan Light Mode' : 'Aktifkan Galaxy Dark Mode');
    if (label) label.textContent = isGalaxy ? 'Galaxy' : 'Light';
    if (icon) icon.className = `fa-solid ${isGalaxy ? 'fa-moon' : 'fa-sun'}`;
    themeMeta?.setAttribute('content', isGalaxy ? '#03050b' : '#dff4ff');
    if (persist) {
      try { localStorage.setItem(THEME_KEY, isGalaxy ? 'galaxy' : 'light'); } catch (_) {}
    }
    onThemeChange?.(isGalaxy);
  };

  applyTheme(root.dataset.theme, false);
  toggle?.addEventListener('click', () => applyTheme(root.dataset.theme === 'galaxy' ? 'light' : 'galaxy'));
}
