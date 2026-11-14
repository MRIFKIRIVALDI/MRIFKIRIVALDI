export function createGalaxyController() {
  const canvas = document.querySelector('#galaxy-canvas');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  let scene;
  let camera;
  let stars;
  let dust;
  let frameId;
  let running = false;
  let initialized = false;
  let active = false;
  let inViewport = !('IntersectionObserver' in window);
  let resizeFrame;
  let targetX = 0;
  let targetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let startTime = 0;

  function makeTexture(THREE) {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 64;
    textureCanvas.height = 64;
    const context = textureCanvas.getContext('2d');
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(textureCanvas);
  }

  function makeField(THREE, texture, count, spread, size, opacity) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = ['#ffffff', '#38bdf8', '#c084fc', '#818cf8', '#67e8f9'].map((value) => new THREE.Color(value));

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * spread;
      positions[index * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[index * 3 + 2] = (Math.random() - 0.5) * spread;
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({
      size,
      map: texture,
      transparent: true,
      opacity,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
  }

  function initialize() {
    if (initialized || !canvas || !window.THREE) return Boolean(initialized);
    const THREE = window.THREE;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 780 ? 1 : 1.25));
      renderer.setSize(window.innerWidth, window.innerHeight);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3500);
      camera.position.z = 950;
      const texture = makeTexture(THREE);
      const mobile = window.innerWidth < 780;
      stars = makeField(THREE, texture, mobile ? 900 : 1800, 2500, 5.2, 1);
      dust = makeField(THREE, texture, mobile ? 140 : 240, 2200, 9, 0.65);
      scene.add(stars, dust);
      initialized = true;
      return true;
    } catch (error) {
      console.warn('Galaxy canvas tidak tersedia:', error);
      return false;
    }
  }

  function animate(time) {
    if (!running) return;
    frameId = requestAnimationFrame(animate);
    const elapsed = (time - startTime) / 1000;
    pointerX += (targetX - pointerX) * 0.04;
    pointerY += (targetY - pointerY) * 0.04;
    camera.position.x = pointerX;
    camera.position.y = -pointerY;
    camera.lookAt(0, 0, 0);
    stars.rotation.y = elapsed * 0.018;
    stars.rotation.x = elapsed * 0.008;
    dust.rotation.y = -elapsed * 0.012;
    renderer.render(scene, camera);
  }

  function renderStaticFrame() {
    if (!initialized) return;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  function updateRunningState() {
    const canRender = active && inViewport;
    const shouldAnimate = canRender && !document.hidden && !reducedMotion.matches;

    if (canRender && !initialized) initialize();
    if (shouldAnimate && initialized && !running) {
      running = true;
      startTime = performance.now();
      frameId = requestAnimationFrame(animate);
    } else if (!shouldAnimate && running) {
      running = false;
      cancelAnimationFrame(frameId);
    }

    if (canRender && initialized && reducedMotion.matches) renderStaticFrame();
  }

  function setActive(nextActive) {
    if (!canvas) return;
    active = nextActive;
    canvas.classList.toggle('is-active', active);
    updateRunningState();
  }

  window.addEventListener('pointermove', (event) => {
    targetX = (event.clientX - window.innerWidth / 2) * 0.22;
    targetY = (event.clientY - window.innerHeight / 2) * 0.22;
  }, { passive: true });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (!initialized) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 780 ? 1 : 1.25));
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (!running) renderStaticFrame();
    });
  }, { passive: true });

  const home = document.querySelector('#home');
  if ('IntersectionObserver' in window && home) {
    new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      updateRunningState();
    }, { threshold: 0, rootMargin: '160px 0px' }).observe(home);
  }

  document.addEventListener('visibilitychange', updateRunningState);
  reducedMotion.addEventListener?.('change', updateRunningState);
  return { setActive };
}
