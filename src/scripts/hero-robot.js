const MODEL_URLS = {
  light: new URL('../assets/images/3d_object/pesawat3d.glb', import.meta.url).href,
  galaxy: new URL('../assets/images/3d_object/astronot3d.glb', import.meta.url).href,
};

const MODEL_LABELS = {
  light: 'Orbit Craft • Light Mode',
  galaxy: 'Astro Unit • Galaxy Mode',
};

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);
const easeOutCubic = (value) => 1 - ((1 - value) ** 3);
const easeInCubic = (value) => value ** 3;

export function createHeroRobot() {
  const canvas = document.querySelector('#hero-robot-canvas');
  const stage = document.querySelector('[data-robot-stage]');
  const statusText = document.querySelector('[data-robot-status-text]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!canvas || !stage || !window.THREE || !window.THREE.GLTFLoader) {
    stage?.classList.add('is-fallback');
    if (statusText) statusText.textContent = '3D loader unavailable';
    return { setGalaxyMode() {} };
  }

  const THREE = window.THREE;
  const loader = new THREE.GLTFLoader();
  const clockStart = performance.now();
  const models = new Map();
  const pendingModels = new Map();
  const pointer = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    hover: 0,
    dragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    moved: 0,
    yaw: 0,
    pitch: 0,
    targetYaw: 0,
    targetPitch: 0,
    velocityYaw: 0,
    velocityPitch: 0,
  };

  let renderer;
  let scene;
  let camera;
  let particles;
  let particleMaterial;
  let activeModel;
  let activeTheme = document.documentElement.dataset.theme === 'galaxy' ? 'galaxy' : 'light';
  let animationFrame;
  let actionType = null;
  let actionStarted = -Infinity;
  let actionNavigated = false;
  let responseTimer;
  let navigationTimer;
  let visible = true;
  let running = false;
  let loadSequence = 0;

  function updateStatus(message) {
    if (statusText) statusText.textContent = message;
  }

  function resetAction(restoreStatus = true) {
    actionType = null;
    actionStarted = -Infinity;
    actionNavigated = false;
    window.clearTimeout(responseTimer);
    window.clearTimeout(navigationTimer);
    stage.classList.remove('is-responding', 'is-plane-flight', 'is-impacting');
    if (activeModel?.toolTrail) {
      activeModel.toolTrail.visible = false;
      activeModel.toolTrail.userData.material.opacity = 0;
    }
    if (restoreStatus && activeModel) updateStatus(MODEL_LABELS[activeTheme]);
  }

  function prepareMaterials(root, theme) {
    root.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = false;
      child.receiveShadow = false;
      child.frustumCulled = true;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.filter(Boolean).forEach((material) => {
        if (material.map) material.map.encoding = THREE.sRGBEncoding;
        material.needsUpdate = true;
        if (theme === 'galaxy' && 'envMapIntensity' in material) material.envMapIntensity = 1.2;
      });
    });
  }

  function createAstronautEyes(fittedBox) {
    const size = fittedBox.getSize(new THREE.Vector3());
    const center = fittedBox.getCenter(new THREE.Vector3());
    const eyes = new THREE.Group();
    const pupils = [];
    const eyeY = fittedBox.max.y - size.y * 0.405;
    const eyeZ = fittedBox.max.z + Math.max(size.z * 0.025, 0.035);
    const separation = size.x * 0.215;
    const eyeRadius = clamp(size.x * 0.032, 0.055, 0.105);

    [-1, 1].forEach((side) => {
      const socket = new THREE.Group();
      socket.position.set(center.x + side * separation, eyeY, eyeZ);

      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(eyeRadius, 20, 14),
        new THREE.MeshBasicMaterial({ color: 0x06182e }),
      );
      pupil.scale.set(1, 0.86, 0.38);
      pupil.position.z = eyeRadius * 0.32;
      pupil.userData.home = pupil.position.clone();

      const glint = new THREE.Mesh(
        new THREE.SphereGeometry(eyeRadius * 0.24, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      glint.position.set(-eyeRadius * 0.3, eyeRadius * 0.28, eyeRadius * 0.85);
      pupil.add(glint);
      pupils.push(pupil);
      socket.add(pupil);
      eyes.add(socket);
    });

    eyes.userData.pupils = pupils;
    return eyes;
  }

  function createToolTrail(fittedBox) {
    const size = fittedBox.getSize(new THREE.Vector3());
    const center = fittedBox.getCenter(new THREE.Vector3());
    const material = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const trail = new THREE.Mesh(
      new THREE.TorusGeometry(size.x * 0.5, 0.05, 10, 64, Math.PI * 1.3),
      material,
    );
    trail.position.set(center.x, center.y - size.y * 0.06, fittedBox.max.z + 0.24);
    trail.rotation.z = -0.62;
    trail.renderOrder = 10;
    trail.visible = false;
    trail.userData.material = material;
    return trail;
  }

  function fitModel(gltf, theme) {
    const pivot = new THREE.Group();
    const fitted = new THREE.Group();
    const asset = gltf.scene;
    fitted.add(asset);
    pivot.add(fitted);
    scene.add(pivot);

    prepareMaterials(asset, theme);
    asset.updateMatrixWorld(true);
    const initialBox = new THREE.Box3().setFromObject(asset);
    const initialSize = initialBox.getSize(new THREE.Vector3());
    const initialCenter = initialBox.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(initialSize.x, initialSize.y, initialSize.z, 0.001);
    const targetSize = theme === 'galaxy' ? 5.55 : 6.3;

    asset.position.sub(initialCenter);
    fitted.scale.setScalar(targetSize / largestDimension);
    fitted.updateMatrixWorld(true);

    const fittedBox = new THREE.Box3().setFromObject(fitted);
    const eyeRig = theme === 'galaxy' ? createAstronautEyes(fittedBox) : null;
    const toolTrail = theme === 'galaxy' ? createToolTrail(fittedBox) : null;
    if (eyeRig) pivot.add(eyeRig);
    if (toolTrail) pivot.add(toolTrail);

    pivot.visible = false;
    pivot.userData.theme = theme;
    pivot.userData.appearStarted = performance.now();
    pivot.userData.eyeRig = eyeRig;
    pivot.userData.toolTrail = toolTrail;
    return { pivot, eyeRig, toolTrail };
  }

  function ensureModel(theme) {
    if (models.has(theme)) return Promise.resolve(models.get(theme));
    if (pendingModels.has(theme)) return pendingModels.get(theme);

    if (theme === activeTheme) {
      stage.classList.add('is-loading');
      updateStatus(theme === 'galaxy' ? 'Loading Astro Unit • 0%' : 'Loading Orbit Craft • 0%');
    }

    const request = new Promise((resolve, reject) => {
      loader.load(
        MODEL_URLS[theme],
        (gltf) => {
          const record = fitModel(gltf, theme);
          models.set(theme, record);
          pendingModels.delete(theme);
          resolve(record);
        },
        (event) => {
          if (theme !== activeTheme || !event.total) return;
          const progress = clamp(Math.round((event.loaded / event.total) * 100), 0, 99);
          updateStatus(`Loading ${theme === 'galaxy' ? 'Astro Unit' : 'Orbit Craft'} • ${progress}%`);
        },
        (error) => {
          pendingModels.delete(theme);
          reject(error);
        },
      );
    });

    pendingModels.set(theme, request);
    return request;
  }

  async function showThemeModel(theme) {
    resetAction(false);
    activeTheme = theme;
    const sequence = ++loadSequence;
    stage.classList.toggle('is-galaxy', theme === 'galaxy');
    if (!models.has(theme)) {
      stage.classList.add('is-loading');
      updateStatus(theme === 'galaxy' ? 'Loading Astro Unit • 0%' : 'Loading Orbit Craft • 0%');
    }

    try {
      const record = await ensureModel(theme);
      if (sequence !== loadSequence || theme !== activeTheme) return;

      if (activeModel && activeModel !== record) activeModel.pivot.visible = false;
      activeModel = record;
      activeModel.pivot.visible = true;
      activeModel.pivot.userData.appearStarted = performance.now();
      pointer.yaw = 0;
      pointer.pitch = 0;
      pointer.targetYaw = 0;
      pointer.targetPitch = 0;
      pointer.velocityYaw = 0;
      pointer.velocityPitch = 0;
      stage.classList.remove('is-loading', 'is-fallback');
      stage.classList.add('is-ready');
      updateStatus(MODEL_LABELS[theme]);
      render();

      if (theme === 'galaxy') {
        window.setTimeout(() => ensureModel('light').catch(() => {}), 900);
      }
    } catch (error) {
      if (sequence !== loadSequence) return;
      stage.classList.remove('is-loading');
      stage.classList.add('is-fallback');
      updateStatus('3D object failed to load');
      console.warn(`Model ${theme} tidak dapat dimuat:`, error);
    }
  }

  function buildParticles() {
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const radius = 2.2 + Math.random() * 3.5;
      const angle = Math.random() * Math.PI * 2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 7.2;
      positions[index * 3 + 2] = Math.sin(angle) * radius - 1.2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleMaterial = new THREE.PointsMaterial({
      color: 0xbdeeff,
      size: 0.045,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
  }

  function resize() {
    if (!renderer) return;
    const width = Math.max(stage.clientWidth, 1);
    const height = Math.max(stage.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function updateEyeTracking(eyeRig, actionEnergy) {
    if (!eyeRig) return;
    eyeRig.visible = Math.cos(pointer.yaw) > 0.88;
    if (!eyeRig.visible) return;
    const pupils = eyeRig.userData.pupils || [];
    pupils.forEach((pupil) => {
      const home = pupil.userData.home;
      pupil.position.x += ((home.x + pointer.x * 0.055) - pupil.position.x) * 0.16;
      pupil.position.y += ((home.y - pointer.y * 0.045) - pupil.position.y) * 0.16;
      const pulse = 1 + actionEnergy * 0.7;
      pupil.scale.setScalar(pulse);
    });
    eyeRig.rotation.y = pointer.x * 0.055;
    eyeRig.rotation.x = pointer.y * 0.035;
  }

  function render(time = performance.now()) {
    if (!renderer) return;
    const elapsed = (time - clockStart) / 1000;
    const actionAge = (time - actionStarted) / 1000;
    const astronautProgress = clamp(actionAge / 1.65, 0, 1);
    const astronautAction = actionType === 'tool-swing' && actionAge >= 0 && actionAge < 1.65;
    const toolEnvelope = astronautAction ? Math.sin(astronautProgress * Math.PI) : 0;
    const toolSwing = astronautAction ? Math.sin(astronautProgress * Math.PI * 5) * toolEnvelope : 0;
    const planeProgress = clamp(actionAge / 1.85, 0, 1);
    const planeAction = actionType === 'plane-flight' && actionAge >= 0 && actionAge < 1.85;

    pointer.x += (pointer.targetX - pointer.x) * 0.065;
    pointer.y += (pointer.targetY - pointer.y) * 0.065;
    if (!pointer.dragging) {
      pointer.targetYaw += pointer.velocityYaw;
      pointer.targetPitch = clamp(pointer.targetPitch + pointer.velocityPitch, -0.42, 0.42);
      pointer.velocityYaw *= 0.9;
      pointer.velocityPitch *= 0.88;
      if (Math.abs(pointer.velocityYaw) < 0.00002) pointer.velocityYaw = 0;
      if (Math.abs(pointer.velocityPitch) < 0.00002) pointer.velocityPitch = 0;
    }
    pointer.yaw += (pointer.targetYaw - pointer.yaw) * 0.13;
    pointer.pitch += (pointer.targetPitch - pointer.pitch) * 0.13;

    if (activeModel) {
      const { pivot, eyeRig, toolTrail } = activeModel;
      const appearProgress = clamp((time - pivot.userData.appearStarted) / 650, 0, 1);
      const appearScale = 0.72 + easeOutCubic(appearProgress) * 0.28;
      const idleFloat = reducedMotion.matches ? 0 : Math.sin(elapsed * 1.05) * 0.16;

      if (activeTheme === 'galaxy') {
        const idlePitch = reducedMotion.matches ? 0 : Math.sin(elapsed * 0.43) * 0.018;
        const idleYaw = reducedMotion.matches ? 0 : Math.sin(elapsed * 0.31) * 0.055;
        pivot.position.set(toolSwing * 0.15, idleFloat + Math.abs(toolSwing) * 0.09, 0);
        pivot.scale.setScalar(appearScale * (1 + toolEnvelope * 0.025));
        pivot.rotation.x = pointer.pitch + idlePitch + toolSwing * 0.06;
        pivot.rotation.y = pointer.yaw + idleYaw + toolSwing * 0.12;
        pivot.rotation.z = toolSwing * 0.25;
        updateEyeTracking(eyeRig, toolEnvelope);
        if (toolTrail) {
          toolTrail.visible = astronautAction;
          toolTrail.userData.material.opacity = toolEnvelope * 0.92;
          toolTrail.rotation.z = -0.62 + toolSwing * 0.58;
          toolTrail.scale.setScalar(0.9 + toolEnvelope * 0.24);
        }
      } else {
        const idlePitch = reducedMotion.matches ? 0 : Math.sin(elapsed * 0.38) * 0.02;
        const idleYaw = reducedMotion.matches ? 0 : Math.sin(elapsed * 0.27) * 0.05;
        let flightScale = 1;
        let flightZ = 0;
        let flightLift = 0;
        let flightBank = 0;
        if (planeAction) {
          if (planeProgress < 0.18) {
            const retreat = easeOutCubic(planeProgress / 0.18);
            flightScale = 1 - retreat * 0.82;
            flightZ = -retreat * 2.5;
            flightLift = retreat * 0.24;
          } else {
            const approach = clamp((planeProgress - 0.18) / 0.82, 0, 1);
            const rush = easeInCubic(approach);
            flightScale = 0.18 + rush * 3.85;
            flightZ = -2.5 + rush * 7.8;
            flightLift = Math.sin(approach * Math.PI) * 0.22;
            flightBank = Math.sin(approach * Math.PI * 6) * (1 - approach) * 0.15;
            stage.classList.toggle('is-impacting', approach > 0.76);
          }
        }
        pivot.position.set(0, idleFloat + flightLift, flightZ);
        pivot.scale.setScalar(appearScale * flightScale);
        pivot.rotation.x = 0.04 + pointer.pitch + idlePitch;
        pivot.rotation.y = -0.08 + pointer.yaw + idleYaw;
        pivot.rotation.z = -0.04 + flightBank;
      }
    }

    if (particles) {
      particles.rotation.y = elapsed * (activeTheme === 'galaxy' ? 0.035 : 0.018);
      particles.rotation.z = Math.sin(elapsed * 0.18) * 0.035;
      const actionEnergy = Math.max(toolEnvelope, planeAction ? Math.sin(planeProgress * Math.PI) : 0);
      particleMaterial.opacity = (activeTheme === 'galaxy' ? 0.78 : 0.46) + actionEnergy * 0.2;
      particleMaterial.size = 0.045 + actionEnergy * 0.05;
    }

    if (!reducedMotion.matches) {
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 11.5 - pointer.hover * 0.08;
      camera.lookAt(0, 0, 0);
    }
    renderer.render(scene, camera);
  }

  function animate(time) {
    if (!running) return;
    animationFrame = requestAnimationFrame(animate);
    render(time);
  }

  function updateRunningState() {
    const shouldRun = visible && !document.hidden && !reducedMotion.matches;
    if (shouldRun && !running) {
      running = true;
      animationFrame = requestAnimationFrame(animate);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(animationFrame);
      render();
    } else if (reducedMotion.matches) {
      render();
    }
  }

  function navigateToSecondPage() {
    if (actionNavigated) return;
    actionNavigated = true;
    const nextSection = document.querySelector('#about');
    if (!nextSection) return;
    window.history.pushState?.(null, '', '#about');
    nextSection.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  function respond() {
    if (!activeModel || actionType) return;
    window.clearTimeout(responseTimer);
    window.clearTimeout(navigationTimer);
    actionStarted = performance.now();
    actionNavigated = false;
    stage.classList.remove('is-responding', 'is-plane-flight', 'is-impacting');
    void stage.offsetWidth;
    stage.classList.add('is-responding');

    if (activeTheme === 'light') {
      actionType = 'plane-flight';
      if (reducedMotion.matches) {
        updateStatus('Opening About section');
        navigateToSecondPage();
        responseTimer = window.setTimeout(() => resetAction(), 500);
        return;
      }
      stage.classList.add('is-plane-flight');
      updateStatus('Approach sequence • Incoming!');
      navigationTimer = window.setTimeout(navigateToSecondPage, 1550);
      responseTimer = window.setTimeout(() => resetAction(), 2200);
      return;
    }

    actionType = 'tool-swing';
    updateStatus('Tool motion • Activated!');
    responseTimer = window.setTimeout(() => resetAction(), 1750);
    if (reducedMotion.matches) render();
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.16;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 11.5);

    scene.add(new THREE.HemisphereLight(0xeef8ff, 0x070916, 1.65));
    scene.add(new THREE.AmbientLight(0xffffff, 0.52));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
    keyLight.position.set(4.5, 6, 8);
    scene.add(keyLight);
    const violetLight = new THREE.PointLight(0xa855f7, 3.4, 18);
    violetLight.position.set(-4, 1.5, 4);
    scene.add(violetLight);
    const cyanLight = new THREE.PointLight(0x22d3ee, 2.8, 18);
    cyanLight.position.set(4, -1.5, 5);
    scene.add(cyanLight);

    buildParticles();
    resize();
    showThemeModel(activeTheme);
  } catch (error) {
    stage.classList.add('is-fallback');
    updateStatus('WebGL unavailable');
    console.warn('Objek 3D Hero tidak dapat dirender:', error);
    return { setGalaxyMode() {} };
  }

  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateRunningState();
  }, { threshold: 0.05 }).observe(stage);

  function updatePointerPosition(event) {
    const bounds = stage.getBoundingClientRect();
    pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  }

  function finishDrag(event, activate = false) {
    if (!pointer.dragging || event.pointerId !== pointer.pointerId) return;
    const isClick = activate && pointer.moved < 7;
    pointer.dragging = false;
    pointer.pointerId = null;
    stage.classList.remove('is-dragging');
    if (stage.hasPointerCapture?.(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    if (isClick) respond();
  }

  stage.addEventListener('pointerdown', (event) => {
    if (!activeModel || actionType || (event.pointerType === 'mouse' && event.button !== 0)) return;
    updatePointerPosition(event);
    pointer.dragging = true;
    pointer.pointerId = event.pointerId;
    pointer.startX = event.clientX;
    pointer.startY = event.clientY;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    pointer.moved = 0;
    pointer.velocityYaw = 0;
    pointer.velocityPitch = 0;
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(event.pointerId);
  });
  stage.addEventListener('pointermove', (event) => {
    updatePointerPosition(event);
    if (!pointer.dragging || event.pointerId !== pointer.pointerId) return;
    const deltaX = event.clientX - pointer.lastX;
    const deltaY = event.clientY - pointer.lastY;
    pointer.lastX = event.clientX;
    pointer.lastY = event.clientY;
    pointer.moved += Math.hypot(deltaX, deltaY);
    pointer.targetYaw += deltaX * 0.009;
    pointer.targetPitch = clamp(pointer.targetPitch + deltaY * 0.007, -0.42, 0.42);
    pointer.velocityYaw = deltaX * 0.0018;
    pointer.velocityPitch = deltaY * 0.0012;
    if (event.cancelable && event.pointerType === 'mouse') event.preventDefault();
  });
  stage.addEventListener('pointerup', (event) => finishDrag(event, true));
  stage.addEventListener('pointercancel', (event) => finishDrag(event, false));
  stage.addEventListener('pointerenter', () => { pointer.hover = 1; }, { passive: true });
  stage.addEventListener('pointerleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    pointer.hover = 0;
  }, { passive: true });
  stage.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      respond();
    }
  });
  document.addEventListener('visibilitychange', updateRunningState);
  reducedMotion.addEventListener?.('change', updateRunningState);
  updateRunningState();

  return {
    setGalaxyMode(isGalaxy) {
      const theme = isGalaxy ? 'galaxy' : 'light';
      renderer.toneMappingExposure = isGalaxy ? 1.28 : 1.1;
      showThemeModel(theme);
    },
  };
}
