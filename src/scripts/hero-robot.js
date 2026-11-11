export function createHeroRobot() {
  const canvas = document.querySelector('#hero-robot-canvas');
  const stage = document.querySelector('[data-robot-stage]');
  const statusText = document.querySelector('[data-robot-status-text]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!canvas || !stage || !window.THREE) return { setGalaxyMode() {} };

  const THREE = window.THREE;
  let renderer;
  let scene;
  let camera;
  let astronaut;
  let helmet;
  let leftArm;
  let rightArm;
  let core;
  let orbitSystem;
  let platform;
  let particles;
  let animationFrame;
  let responseTimer;
  let visible = true;
  let running = false;
  let interactionPulse = 0;
  let waveStarted = -Infinity;
  const startedAt = performance.now();
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, hover: 0 };

  const materials = {
    suit: new THREE.MeshStandardMaterial({ color: 0xe8eef8, metalness: 0.34, roughness: 0.38 }),
    suitShadow: new THREE.MeshStandardMaterial({ color: 0x8fa3c2, metalness: 0.55, roughness: 0.34 }),
    panel: new THREE.MeshStandardMaterial({ color: 0x121c39, metalness: 0.78, roughness: 0.25 }),
    joint: new THREE.MeshStandardMaterial({ color: 0x050817, metalness: 0.88, roughness: 0.2 }),
    cyan: new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x0891b2, emissiveIntensity: 1.55, metalness: 0.42, roughness: 0.2 }),
    violet: new THREE.MeshStandardMaterial({ color: 0xc4b5fd, emissive: 0x7c3aed, emissiveIntensity: 1.45, metalness: 0.4, roughness: 0.22 }),
    visor: new THREE.MeshPhysicalMaterial({
      color: 0x07132f,
      emissive: 0x0b1f55,
      emissiveIntensity: 0.85,
      metalness: 0.58,
      roughness: 0.04,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    }),
  };

  function addEdges(mesh, color = 0xa5b4fc, opacity = 0.18) {
    mesh.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    ));
    return mesh;
  }

  function box(width, height, depth, material, position = [0, 0, 0], edgeColor) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(...position);
    return addEdges(mesh, edgeColor);
  }

  function cylinder(top, bottom, height, material, position = [0, 0, 0], rotation = [0, 0, 0], segments = 28) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, segments), material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    return mesh;
  }

  function sphere(radius, material, position = [0, 0, 0], scale = [1, 1, 1]) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    return mesh;
  }

  function torus(radius, tube, material, position = [0, 0, 0], rotation = [0, 0, 0], arc = Math.PI * 2) {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 14, 72, arc), material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    return mesh;
  }

  function buildAstronaut() {
    astronaut = new THREE.Group();
    astronaut.scale.setScalar(0.9);

    astronaut.add(box(1.55, 2.1, 0.62, materials.panel, [0, 0.15, -0.82], 0x38bdf8));
    astronaut.add(cylinder(0.13, 0.2, 0.55, materials.cyan, [-0.48, -1.12, -0.87]));
    astronaut.add(cylinder(0.13, 0.2, 0.55, materials.violet, [0.48, -1.12, -0.87]));

    const torso = new THREE.Group();
    torso.add(box(2.2, 2.25, 1.18, materials.suit, [0, 0.15, 0], 0x818cf8));
    torso.add(box(1.58, 1.18, 0.15, materials.panel, [0, 0.34, 0.68], 0x67e8f9));
    torso.add(box(1.25, 0.3, 0.08, materials.suitShadow, [0, -0.42, 0.79], 0xc4b5fd));
    torso.add(box(0.13, 1.42, 0.08, materials.cyan, [-0.86, 0.16, 0.75]));
    torso.add(box(0.13, 1.42, 0.08, materials.violet, [0.86, 0.16, 0.75]));
    torso.add(torus(0.36, 0.075, materials.cyan, [0, 0.48, 0.81]));
    core = sphere(0.23, materials.violet.clone(), [0, 0.48, 0.85]);
    torso.add(core);
    torso.add(cylinder(0.18, 0.18, 0.05, materials.violet, [0.63, 0.72, 0.78], [Math.PI / 2, 0, 0]));
    torso.add(cylinder(0.29, 0.29, 0.42, materials.joint, [0, 1.5, 0]));
    astronaut.add(torso);

    helmet = new THREE.Group();
    helmet.position.set(0, 2.22, 0.02);
    helmet.add(sphere(1.08, materials.suit, [0, 0, 0], [1, 0.94, 0.92]));
    helmet.add(sphere(0.93, materials.visor, [0, 0.02, 0.86], [0.86, 0.64, 0.24]));
    const visorRim = torus(0.88, 0.085, materials.suitShadow, [0, 0.02, 1.01]);
    visorRim.scale.y = 0.72;
    helmet.add(visorRim);
    helmet.add(cylinder(0.28, 0.28, 0.28, materials.panel, [-1.02, 0, 0], [0, 0, Math.PI / 2]));
    helmet.add(cylinder(0.28, 0.28, 0.28, materials.panel, [1.02, 0, 0], [0, 0, Math.PI / 2]));
    helmet.add(cylinder(0.035, 0.045, 0.52, materials.suitShadow, [0.7, 0.98, 0], [0, 0, -0.24]));
    helmet.add(sphere(0.1, materials.violet, [0.77, 1.23, 0]));
    helmet.add(box(0.78, 0.07, 0.035, materials.cyan, [0, -0.08, 1.11]));
    astronaut.add(helmet);

    const jointGeometry = new THREE.SphereGeometry(0.34, 22, 18);
    const makeArm = (side) => {
      const arm = new THREE.Group();
      arm.position.set(side * 1.35, 0.95, 0);
      arm.add(sphere(0.5, materials.suitShadow));
      arm.add(cylinder(0.31, 0.4, 1.25, materials.suit, [side * 0.09, -0.78, 0], [0, 0, side * -0.08]));
      const elbow = new THREE.Mesh(jointGeometry, materials.joint);
      elbow.position.set(side * 0.16, -1.44, 0);
      arm.add(elbow);
      arm.add(cylinder(0.28, 0.34, 1.08, materials.suitShadow, [side * 0.18, -2.03, 0.04], [0, 0, side * 0.08]));
      arm.add(sphere(0.37, side < 0 ? materials.cyan : materials.violet, [side * 0.22, -2.62, 0.08], [0.92, 1.02, 0.88]));
      return arm;
    };

    leftArm = makeArm(-1);
    rightArm = makeArm(1);
    astronaut.add(leftArm, rightArm);
    astronaut.add(box(1.65, 0.58, 1.04, materials.panel, [0, -1.28, 0], 0x818cf8));

    [-0.55, 0.55].forEach((x, index) => {
      astronaut.add(cylinder(0.36, 0.43, 1.3, materials.suit, [x, -2.08, 0]));
      const knee = new THREE.Mesh(jointGeometry, index ? materials.violet : materials.cyan);
      knee.scale.setScalar(0.8);
      knee.position.set(x, -2.77, 0.09);
      astronaut.add(knee);
      astronaut.add(box(0.76, 0.9, 0.8, materials.suitShadow, [x, -3.28, 0.04], 0x818cf8));
      astronaut.add(box(0.88, 0.34, 1.18, materials.panel, [x, -3.76, 0.24], 0x67e8f9));
    });

    astronaut.add(torus(0.72, 0.035, materials.cyan, [-0.55, -0.02, 0.74], [0, 0, 0.35], Math.PI * 1.4));
    scene.add(astronaut);

    orbitSystem = new THREE.Group();
    orbitSystem.add(torus(3.1, 0.016, materials.violet, [0, 0, 0], [1.18, 0.2, 0.2]));
    orbitSystem.add(torus(2.8, 0.012, materials.cyan, [0, 0, 0], [1.35, -0.25, -0.35]));
    orbitSystem.add(sphere(0.1, materials.cyan, [2.66, 0.7, 0.2]));
    orbitSystem.add(sphere(0.13, materials.violet, [-2.55, -0.85, 0]));
    scene.add(orbitSystem);

    platform = new THREE.Group();
    platform.position.y = -3.62;
    const outerRing = torus(2.25, 0.04, materials.cyan, [0, 0, 0], [Math.PI / 2, 0, 0]);
    const innerRing = torus(1.68, 0.025, materials.violet, [0, 0, 0], [Math.PI / 2, 0, 0]);
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(2.08, 64),
      new THREE.MeshBasicMaterial({ color: 0x4338ca, transparent: true, opacity: 0.11, depthWrite: false }),
    );
    glow.rotation.x = -Math.PI / 2;
    platform.add(outerRing, innerRing, glow);
    scene.add(platform);
  }

  function buildParticles() {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 8.5;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0xb6e6ff, size: 0.035, transparent: true, opacity: 0.78, depthWrite: false }),
    );
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

  function render(time = performance.now()) {
    if (!renderer) return;
    const elapsed = (time - startedAt) / 1000;
    const waveAge = (time - waveStarted) / 1000;
    const waving = waveAge >= 0 && waveAge < 1.8;
    const waveEnvelope = waving ? Math.sin(Math.min(waveAge / 0.3, 1) * Math.PI / 2) * Math.min((1.8 - waveAge) / 0.45, 1) : 0;

    pointer.x += (pointer.targetX - pointer.x) * 0.055;
    pointer.y += (pointer.targetY - pointer.y) * 0.055;
    interactionPulse *= 0.94;

    if (!reducedMotion.matches) {
      astronaut.position.y = 0.04 + Math.sin(elapsed * 1.15) * 0.16;
      astronaut.rotation.y = Math.sin(elapsed * 0.34) * 0.18 + pointer.x * 0.14;
      astronaut.rotation.x = Math.sin(elapsed * 0.42) * 0.025 + pointer.y * 0.035;
      helmet.rotation.y = Math.sin(elapsed * 0.58) * 0.08 + pointer.x * 0.14;
      helmet.rotation.x = pointer.y * 0.09;
      leftArm.rotation.z = Math.sin(elapsed * 0.82) * 0.035;
      rightArm.rotation.z = -Math.sin(elapsed * 0.82) * 0.035 - waveEnvelope * 2.05;
      rightArm.rotation.y = waving ? Math.sin(waveAge * 10) * 0.14 : 0;
      orbitSystem.rotation.y = elapsed * 0.16 + pointer.x * 0.12;
      orbitSystem.rotation.z = Math.sin(elapsed * 0.28) * 0.12;
      platform.rotation.y = elapsed * 0.2;
      particles.rotation.y = elapsed * 0.028;
      core.scale.setScalar(1 + Math.sin(elapsed * 2.5) * 0.1 + interactionPulse * 0.22);
      core.material.emissiveIntensity = 1.45 + Math.sin(elapsed * 2.5) * 0.4 + interactionPulse * 2;
      camera.position.x = pointer.x * 0.28;
      camera.position.y = -0.08 - pointer.y * 0.18;
      camera.position.z = 11.5 - pointer.hover * 0.12;
      camera.lookAt(0, -0.18, 0);
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

  function respond() {
    waveStarted = performance.now();
    interactionPulse = 1;
    stage.classList.add('is-responding');
    if (statusText) statusText.textContent = 'Signal received • Hello!';
    window.clearTimeout(responseTimer);
    responseTimer = window.setTimeout(() => {
      stage.classList.remove('is-responding');
      if (statusText) statusText.textContent = 'Astro Unit • Online';
    }, 1900);
    if (reducedMotion.matches) render();
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, -0.08, 11.5);
    scene.add(new THREE.HemisphereLight(0xe0e7ff, 0x060817, 1.45));
    const key = new THREE.DirectionalLight(0xffffff, 2.45);
    key.position.set(4, 6, 7);
    scene.add(key);
    const violetLight = new THREE.PointLight(0xa855f7, 3.3, 18);
    violetLight.position.set(-4, 1, 4);
    scene.add(violetLight);
    const cyanLight = new THREE.PointLight(0x22d3ee, 2.5, 16);
    cyanLight.position.set(4, -2, 3);
    scene.add(cyanLight);

    buildAstronaut();
    buildParticles();
    resize();
    stage.classList.add('is-ready');
  } catch (error) {
    stage.classList.add('is-fallback');
    console.warn('Robot astronot 3D tidak dapat dirender:', error);
    return { setGalaxyMode() {} };
  }

  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    updateRunningState();
  }, { threshold: 0.05 }).observe(stage);

  stage.addEventListener('pointermove', (event) => {
    const bounds = stage.getBoundingClientRect();
    pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  }, { passive: true });
  stage.addEventListener('pointerenter', () => { pointer.hover = 1; }, { passive: true });
  stage.addEventListener('pointerleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
    pointer.hover = 0;
  }, { passive: true });
  stage.addEventListener('click', respond);
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
      stage.classList.toggle('is-galaxy', isGalaxy);
      materials.visor.emissiveIntensity = isGalaxy ? 1.25 : 0.75;
      materials.cyan.emissiveIntensity = isGalaxy ? 1.9 : 1.35;
      materials.violet.emissiveIntensity = isGalaxy ? 1.8 : 1.25;
      particles.material.opacity = isGalaxy ? 0.92 : 0.6;
      if (renderer) renderer.toneMappingExposure = isGalaxy ? 1.32 : 1.1;
      render();
    },
  };
}
