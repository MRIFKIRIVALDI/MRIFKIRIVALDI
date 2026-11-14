import { supportedLanguages, translations } from '../data/translations.js';

const STORAGE_KEY = 'portfolio-language';
const DEFAULT_LANGUAGE = 'id';
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'aria-label', 'title'];
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'CANVAS', 'SVG']);
const originalText = new WeakMap();
const originalAttributes = new WeakMap();

let currentLanguage = DEFAULT_LANGUAGE;
let observer;
let translationQueued = false;

const normalize = (value) => value.replace(/\s+/g, ' ').trim();

function isSupported(language) {
  return supportedLanguages.some((item) => item.code === language);
}

export function getCurrentLanguage() {
  const language = document.documentElement.dataset.language;
  return isSupported(language) ? language : currentLanguage;
}

export function translateRuntimeText(source, requestedLanguage = getCurrentLanguage()) {
  const language = isSupported(requestedLanguage) ? requestedLanguage : DEFAULT_LANGUAGE;
  if (language === DEFAULT_LANGUAGE) return source;

  const normalizedSource = normalize(String(source));
  const toolsCount = normalizedSource.match(/^(\d+) teknologi ditampilkan$/i);
  if (toolsCount) {
    const count = toolsCount[1];
    const countFormats = {
      en: `${count} technologies shown`,
      ar: `تم عرض ${count} تقنية`,
      ja: `${count}件の技術を表示`,
      zh: `显示 ${count} 项技术`,
      ko: `${count}개 기술 표시`,
    };
    return countFormats[language] || source;
  }

  return translations[language]?.[normalizedSource] || source;
}

function translateTextNode(node, language) {
  if (!originalText.has(node)) originalText.set(node, node.nodeValue);
  const source = originalText.get(node);
  const normalizedSource = normalize(source);
  if (!normalizedSource) return;

  const translated = translateRuntimeText(normalizedSource, language);
  const leadingWhitespace = source.match(/^\s*/)?.[0] || '';
  const trailingWhitespace = source.match(/\s*$/)?.[0] || '';
  const nextValue = `${leadingWhitespace}${translated}${trailingWhitespace}`;
  if (node.nodeValue !== nextValue) node.nodeValue = nextValue;
}

function translateTextContent(language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIPPED_TAGS.has(parent.tagName) || parent.closest('[data-i18n-ignore]')) {
        return NodeFilter.FILTER_REJECT;
      }
      return normalize(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    translateTextNode(node, language);
    node = walker.nextNode();
  }
}

function getOriginalAttribute(element, attribute) {
  let attributes = originalAttributes.get(element);
  if (!attributes) {
    attributes = new Map();
    originalAttributes.set(element, attributes);
  }
  if (!attributes.has(attribute)) attributes.set(attribute, element.getAttribute(attribute));
  return attributes.get(attribute);
}

function translateAttributes(language) {
  const selector = TRANSLATABLE_ATTRIBUTES.map((attribute) => `[${attribute}]`).join(',');
  document.querySelectorAll(selector).forEach((element) => {
    if (element.closest('[data-i18n-ignore]')) return;
    TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const source = getOriginalAttribute(element, attribute);
      const translated = translateRuntimeText(source, language);
      if (element.getAttribute(attribute) !== translated) element.setAttribute(attribute, translated);
    });
  });
}

function translateMetadata(language) {
  const title = 'M. Rifki Rivaldi — Tech & IoT Specialist';
  const description = 'Portofolio M. Rifki Rivaldi, Tech & IoT Specialist yang berfokus pada web development, IoT, jaringan, dan desain digital.';
  document.title = translateRuntimeText(title, language);
  const metaDescription = document.querySelector('meta[name="description"]');
  metaDescription?.setAttribute('content', translateRuntimeText(description, language));
}

function translateDynamicElements(language) {
  document.querySelectorAll('[data-i18n-dynamic="tools-count"]').forEach((element) => {
    const count = Number.parseInt(element.dataset.i18nCount || '0', 10);
    const source = `${Number.isFinite(count) ? count : 0} teknologi ditampilkan`;
    const translated = translateRuntimeText(source, language);
    if (element.textContent !== translated) element.textContent = translated;
  });
}

function applyTranslations(language) {
  translateTextContent(language);
  translateAttributes(language);
  translateMetadata(language);
  translateDynamicElements(language);
}

function scheduleTranslation() {
  if (translationQueued) return;
  translationQueued = true;
  requestAnimationFrame(() => {
    translationQueued = false;
    applyTranslations(currentLanguage);
  });
}

function setLanguage(language, persist = true) {
  const nextLanguage = isSupported(language) ? language : DEFAULT_LANGUAGE;
  const definition = supportedLanguages.find((item) => item.code === nextLanguage);
  currentLanguage = nextLanguage;

  const root = document.documentElement;
  root.dataset.language = nextLanguage;
  root.lang = nextLanguage === 'zh' ? 'zh-CN' : nextLanguage;
  root.dir = definition?.direction || 'ltr';

  const selector = document.querySelector('[data-language-select]');
  if (selector) selector.value = nextLanguage;

  applyTranslations(nextLanguage);
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, nextLanguage); } catch (_) {}
  }
  window.dispatchEvent(new CustomEvent('portfolio:languagechange', { detail: { language: nextLanguage } }));
}

export function initTranslator() {
  const selector = document.querySelector('[data-language-select]');
  let savedLanguage = DEFAULT_LANGUAGE;
  try { savedLanguage = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANGUAGE; } catch (_) {}

  setLanguage(savedLanguage, false);
  selector?.addEventListener('change', (event) => setLanguage(event.currentTarget.value));

  observer?.disconnect();
  observer = new MutationObserver(scheduleTranslation);
  observer.observe(document.body, { childList: true, subtree: true });

  return { setLanguage, getLanguage: getCurrentLanguage };
}
