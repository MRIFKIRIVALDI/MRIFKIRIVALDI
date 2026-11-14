const TEXT = 'PORTOFOLIO';
const FACES = ['line', 'solid', 'line'];
const SPEED = 1.35;
const DESKTOP_WAVES = 1.25;
const MOBILE_WAVES = 0.9;
const WAVE_LERP = 0.06;
const RESIZE_DELAY = 80;
const FRAME_INTERVAL = 1000 / 30;
const TWO_PI = Math.PI * 2;
const FACE_ANGLE = TWO_PI / 3;

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

export function createAboutPrism() {
  const container = document.querySelector('[data-about-prism]');
  const canvas = container?.querySelector('[data-about-prism-canvas]');
  if (!container || !canvas) return { rebuild() {} };

  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return { rebuild() {} };

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layers = { solid: null, line: null };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let capHeight = 0;
  let centerY = 0;
  let pointerRatio = 0.5;
  let currentWaves = baseWaves();
  let targetWaves = currentWaves;
  let resizeTimer;
  let animationFrame;
  let inViewport = true;
  let running = false;
  let lastDrawTime = 0;

  function baseWaves() {
    return window.innerWidth < 600 ? MOBILE_WAVES : DESKTOP_WAVES;
  }

  function resolveCanvasColor(value, fallback) {
    context.fillStyle = fallback;
    context.fillStyle = value || fallback;
    return context.fillStyle;
  }

  function createLayer(drawText) {
    const layerCanvas = document.createElement('canvas');
    layerCanvas.width = width;
    layerCanvas.height = height;
    const layerContext = layerCanvas.getContext('2d', { alpha: true });
    drawText(layerContext);
    return layerCanvas;
  }

  function build() {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 600 ? 1 : 1.5);
    width = Math.max(1, Math.round(bounds.width * dpr));
    height = Math.max(1, Math.round(bounds.height * dpr));
    canvas.width = width;
    canvas.height = height;

    const styles = getComputedStyle(container.closest('.about-reference-shell') || container);
    const fontFamily = styles.getPropertyValue('--font-sans').trim() || styles.fontFamily;
    const fallbackColor = styles.color;
    const solidColor = resolveCanvasColor(styles.getPropertyValue('--about-prism-solid').trim(), fallbackColor);
    const lineColor = resolveCanvasColor(styles.getPropertyValue('--about-prism-outline').trim(), fallbackColor);

    context.font = `800 ${100 * dpr}px ${fontFamily}`;
    const measuredWidth = Math.max(context.measureText(TEXT).width, 1);
    const size = Math.min((width * 0.99 / measuredWidth) * 100 * dpr, height * 0.62);
    const font = `800 ${size}px ${fontFamily}`;

    context.font = font;
    const metrics = context.measureText(TEXT);
    const ascent = metrics.actualBoundingBoxAscent || size * 0.76;
    const descent = metrics.actualBoundingBoxDescent || size * 0.24;
    capHeight = ascent + descent;

    const centerX = width / 2;
    centerY = height / 2;
    const baseline = centerY + (ascent - descent) / 2;

    layers.solid = createLayer((layerContext) => {
      layerContext.font = font;
      layerContext.textAlign = 'center';
      layerContext.textBaseline = 'alphabetic';
      layerContext.fillStyle = solidColor;
      layerContext.fillText(TEXT, centerX, baseline);
    });

    layers.line = createLayer((layerContext) => {
      layerContext.font = font;
      layerContext.textAlign = 'center';
      layerContext.textBaseline = 'alphabetic';
      layerContext.strokeStyle = lineColor;
      layerContext.lineWidth = Math.max(1.4 * dpr, size * 0.012);
      layerContext.lineJoin = 'round';
      layerContext.strokeText(TEXT, centerX, baseline);
    });

    const baselineWaves = baseWaves();
    if (!Number.isFinite(currentWaves)) currentWaves = baselineWaves;
    targetWaves = baselineWaves * (0.75 + pointerRatio * 0.5);
    draw(performance.now() / 1000);
  }

  function draw(time) {
    if (!width || !height || !capHeight || !layers.solid || !layers.line) return;

    currentWaves += (targetWaves - currentWaves) * WAVE_LERP;
    context.clearRect(0, 0, width, height);

    const prismHeight = capHeight * 1.04;
    const apothem = prismHeight / (2 * Math.sqrt(3));
    const sourceY = centerY - prismHeight / 2;
    const cssSliceWidth = window.innerWidth < 600 ? 4 : 3;
    const sliceWidth = Math.max(1, Math.round(cssSliceWidth * dpr));

    for (let x = 0; x < width; x += sliceWidth) {
      const phase = (x / width) * currentWaves * TWO_PI - time * SPEED;
      const sampledWidth = Math.min(sliceWidth, width - x);

      for (let face = 0; face < 3; face += 1) {
        const angle = phase + face * FACE_ANGLE;
        const cosine = Math.cos(angle);
        if (cosine <= 0.001) continue;

        const destinationHeight = prismHeight * cosine;
        const destinationY = centerY - apothem * Math.sin(angle) - destinationHeight / 2;
        context.drawImage(
          layers[FACES[face]],
          x,
          sourceY,
          sampledWidth,
          prismHeight,
          x,
          destinationY,
          sampledWidth,
          destinationHeight,
        );
      }
    }
  }

  function animate(timestamp) {
    if (!running) return;
    if (timestamp - lastDrawTime >= FRAME_INTERVAL) {
      lastDrawTime = timestamp;
      draw(timestamp / 1000);
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function updateAnimation() {
    const shouldRun = inViewport && !document.hidden && !reducedMotion.matches;
    if (shouldRun && !running) {
      running = true;
      lastDrawTime = 0;
      animationFrame = requestAnimationFrame(animate);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(animationFrame);
    }

    if (reducedMotion.matches) {
      currentWaves = targetWaves;
      draw(0);
    }
  }

  function scheduleBuild() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      build();
      updateAnimation();
    }, RESIZE_DELAY);
  }

  function handlePointerMove(event) {
    const baselineWaves = baseWaves();
    pointerRatio = clamp(event.clientX / Math.max(window.innerWidth, 1), 0, 1);
    targetWaves = baselineWaves * (0.75 + pointerRatio * 0.5);
    if (reducedMotion.matches) {
      currentWaves = targetWaves;
      draw(0);
    }
  }

  const intersectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      updateAnimation();
    }, { threshold: 0.04 })
    : null;
  intersectionObserver?.observe(container);

  const themeObserver = new MutationObserver(scheduleBuild);
  themeObserver.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] });

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('resize', scheduleBuild, { passive: true });
  document.addEventListener('visibilitychange', updateAnimation);
  reducedMotion.addEventListener?.('change', updateAnimation);

  const fontFamily = getComputedStyle(container).getPropertyValue('--font-sans').trim();
  Promise.resolve(document.fonts?.load(`800 100px ${fontFamily}`))
    .catch(() => [])
    .finally(() => {
      currentWaves = baseWaves();
      targetWaves = currentWaves;
      build();
      updateAnimation();
    });

  return { rebuild: scheduleBuild };
}
