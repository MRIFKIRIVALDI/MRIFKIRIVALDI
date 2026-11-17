const THREE_URL = new URL('../vendor/three/three.min.js', import.meta.url).href;
const GLTF_LOADER_URL = new URL('../vendor/three/GLTFLoader.js', import.meta.url).href;
const DRACO_LOADER_URL = new URL('../vendor/three/DRACOLoader.js', import.meta.url).href;

const scriptLoads = new Map();
let runtimePromise;

function loadScript(source, isReady) {
  if (isReady()) return Promise.resolve();
  if (scriptLoads.has(source)) return scriptLoads.get(source);

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    script.dataset.threeRuntime = '';
    script.addEventListener('load', () => {
      if (isReady()) resolve();
      else reject(new Error(`Runtime 3D tidak tersedia setelah memuat ${source}`));
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Gagal memuat ${source}`)), { once: true });
    document.head.append(script);
  });

  scriptLoads.set(source, promise);
  return promise;
}

export function loadThreeRuntime() {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    await loadScript(THREE_URL, () => Boolean(window.THREE));
    await loadScript(GLTF_LOADER_URL, () => Boolean(window.THREE?.GLTFLoader));
    await loadScript(DRACO_LOADER_URL, () => Boolean(window.THREE?.DRACOLoader));
    return window.THREE;
  })().catch((error) => {
    runtimePromise = null;
    throw error;
  });

  return runtimePromise;
}
