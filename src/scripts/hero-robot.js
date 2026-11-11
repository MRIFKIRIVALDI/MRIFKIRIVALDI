export function createHeroRobot() {
  const canvas = document.querySelector('#hero-robot-canvas');
  const stage = document.querySelector('[data-robot-stage]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  let scene;
  let camera;
  let robot;
  let head;
  let leftArm;
  let rightArm;
  let core;
  let platform;
  let particles;
  let animationFrame;
  let visible = true;
  let running = false;
  let startTime = performance.now();
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  if (!canvas || !stage || !window.THREE) return { setGalaxyMode() {} };
  const THREE = window.THREE;

  const materials = {
    shell: new THREE.MeshStandardMaterial({ color: 0x111a35, metalness: 0.82, roughness: 0.26 }),
    shellSoft: new THREE.MeshStandardMaterial({ color: 0x24315d, metalness: 0.68, roughness: 0.3 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x050817, metalness: 0.9, roughness: 0.2 }),
    cyan: new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0891b2,
      emissiveIntensity: 1.45,
      metalness: 0.42,
      roughness: 0.2,
    }),
    violet: new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      emissive: 0x7c3aed,
      emissiveIntensity: 1.35,
      metalness: 0.4,
      roughness: 0.22,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x111c48,
      emissive: 0x172554,
      emissiveIntensity: 0.45,
      metalness: 0.2,
      roughness: 0.08,
      transparent: true,
      opacity: 0.88,
    }),
  };

  function addEdges(mesh, color = 0x7dd3fc, opacity = 0.16) {
    const lines = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    );
    mesh.add(lines);
    return mesh;
  }

  function box(width, height, depth, material, position = [0, 0, 0], edgeColor) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(...position);
    return addEdges(mesh, edgeColor);
  }

  function cylinder(top, bottom, height, material, position = [0, 0, 0], rotation = [0, 0, 0]) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, 24), material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    return mesh;
  }

  function buildRobot() {
    robot = new THREE.Group();
    robot.position.y = 0.05;

    const torso = new THREE.Group();
    torso.add(box(2.25, 2.25, 1.28, materials.shell, [0, 0.25, 0], 0x818cf8));
    torso.add(box(1.65, 1.42, 0.16, materials.shellSoft, [0, 0.38, 0.72], 0xc4b5fd));
    torso.add(box(0.18, 1.55, 0.1, materials.cyan, [-0.73, 0.38, 0.84]));
    torso.add(box(0.18, 1.55, 0.1, materials.violet, [0.73, 0.38, 0.84], 0xc084fc));

    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.08, 16, 48), materials.cyan);
    coreRing.position.set(0, 0.5, 0.86);
    torso.add(coreRing);
    core = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 18), materials.violet.clone());
    core.position.set(0, 0.5, 0.91);
    torso.add(core);
    torso.add(cylinder(0.22, 0.22, 0.48, materials.dark, [0, 1.62, 0]));
    robot.add(torso);

    head = new THREE.Group();
    head.position.set(0, 2.2, 0);
    head.add(box(2.05, 1.18, 1.2, materials.shellSoft, [0, 0, 0], 0xa5b4fc));
    head.add(box(1.72, 0.58, 0.13, materials.glass, [0, 0.04, 0.66], 0x38bdf8));
    [-0.17, 0, 0.17].forEach((offset, index) => {
      head.add(box(1.25 - index * 0.08, 0.055, 0.035, index === 1 ? materials.violet : materials.cyan, [0, offset + 0.04, 0.75]));
    });
    head.add(cylinder(0.045, 0.045, 0.46, materials.shellSoft, [0.67, 0.78, 0], [0, 0, -0.18]));
    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 14), materials.violet);
    antennaTip.position.set(0.75, 1.01, 0);
    head.add(antennaTip);
    robot.add(head);

    const shoulderGeometry = new THREE.SphereGeometry(0.48, 24, 18);
    const jointGeometry = new THREE.SphereGeometry(0.34, 20, 16);
    const makeArm = (side) => {
      const arm = new THREE.Group();
      arm.position.set(side * 1.45, 0.95, 0);
      arm.add(new THREE.Mesh(shoulderGeometry, side < 0 ? materials.cyan : materials.violet));
      arm.add(cylinder(0.31, 0.38, 1.3, materials.shellSoft, [side * 0.13, -0.8, 0], [0, 0, side * -0.12]));
      const elbow = new THREE.Mesh(jointGeometry, materials.dark);
      elbow.position.set(side * 0.21, -1.48, 0);
      arm.add(elbow);
      arm.add(cylinder(0.27, 0.32, 1.15, materials.shell, [side * 0.19, -2.08, 0.06], [0, 0, side * 0.08]));
      arm.add(box(0.52, 0.55, 0.55, materials.dark, [side * 0.24, -2.7, 0.08], 0x818cf8));
      return arm;
    };

    leftArm = makeArm(-1);
    rightArm = makeArm(1);
    robot.add(leftArm, rightArm);

    const lowerBody = new THREE.Group();
    lowerBody.add(box(1.55, 0.55, 1.02, materials.dark, [0, -1.15, 0], 0x818cf8));
    [-0.55, 0.55].forEach((x, index) => {
      lowerBody.add(cylinder(0.37, 0.44, 1.45, index ? materials.shellSoft : materials.shell, [x, -2.05, 0]));
      const knee = new THREE.Mesh(jointGeometry, index ? materials.violet : materials.cyan);
      knee.scale.set(0.78, 0.78, 0.78);
      knee.position.set(x, -2.78, 0.08);
      lowerBody.add(knee);
      lowerBody.add(box(0.78, 0.42, 1.15, materials.dark, [x, -3.25, 0.24], 0x6366f1));
    });
    robot.add(lowerBody);
    scene.add(robot);

    platform = new THREE.Group();
    platform.position.y = -3.58;
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.04, 12, 96), materials.cyan);
    outerRing.rotation.x = Math.PI / 2;
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.025, 10, 80), materials.violet);
    innerRing.rotation.x = Math.PI / 2;
    const platformGlow = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 64),
      new THREE.MeshBasicMaterial({ color: 0x4338ca, transparent: true, opacity: 0.09, depthWrite: false }),
    );
    platformGlow.rotation.x = -Math.PI / 2;
    platform.add(outerRing, innerRing, platformGlow);
    scene.add(platform);
  }

  function buildParticles() {
    const count = 90;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 8;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.035, transparent: true, opacity: 0.72, depthWrite: false }),
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
    const elapsed = (time - startTime) / 1000;
    pointer.x += (pointer.targetX - pointer.x) * 0.045;
    pointer.y += (pointer.targetY - pointer.y) * 0.045;

    if (!reducedMotion.matches) {
      robot.position.y = 0.05 + Math.sin(elapsed * 1.15) * 0.16;
      robot.rotation.y = Math.sin(elapsed * 0.34) * 0.22 + pointer.x * 0.13;
      robot.rotation.x = Math.sin(elapsed * 0.42) * 0.025 + pointer.y * 0.035;
      head.rotation.y = Math.sin(elapsed * 0.58) * 0.1 + pointer.x * 0.12;
      head.rotation.x = pointer.y * 0.08;
      leftArm.rotation.z = Math.sin(elapsed * 0.82) * 0.035;
      rightArm.rotation.z = -Math.sin(elapsed * 0.82) * 0.035;
      platform.rotation.y = elapsed * 0.18;
      particles.rotation.y = elapsed * 0.025;
      core.scale.setScalar(1 + Math.sin(elapsed * 2.3) * 0.11);
      core.material.emissiveIntensity = 1.4 + Math.sin(elapsed * 2.3) * 0.45;
      camera.position.x = pointer.x * 0.24;
      camera.position.y = -0.05 - pointer.y * 0.17;
      camera.lookAt(0, -0.15, 0);
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
      startTime = performance.now();
      animationFrame = requestAnimationFrame(animate);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(animationFrame);
      render();
    } else if (reducedMotion.matches) {
      render();
    }
  }

  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, -0.05, 11.4);
    scene.add(new THREE.HemisphereLight(0xc7d2fe, 0x080b1d, 1.35));

    const key = new THREE.DirectionalLight(0x9ee8ff, 2.5);
    key.position.set(4, 6, 7);
    scene.add(key);
    const violetLight = new THREE.PointLight(0xa855f7, 3.3, 18);
    violetLight.position.set(-4, 1, 4);
    scene.add(violetLight);
    const cyanLight = new THREE.PointLight(0x22d3ee, 2.4, 16);
    cyanLight.position.set(4, -2, 3);
    scene.add(cyanLight);

    buildRobot();
    buildParticles();
    resize();
    stage.classList.add('is-ready');
  } catch (error) {
    stage.classList.add('is-fallback');
    console.warn('Robot 3D tidak dapat dirender:', error);
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
  stage.addEventListener('pointerleave', () => {
    pointer.targetX = 0;
    pointer.targetY = 0;
  }, { passive: true });
  document.addEventListener('visibilitychange', updateRunningState);
  reducedMotion.addEventListener?.('change', updateRunningState);
  updateRunningState();

  return {
    setGalaxyMode(isGalaxy) {
      stage.classList.toggle('is-galaxy', isGalaxy);
      if (renderer) renderer.toneMappingExposure = isGalaxy ? 1.35 : 1.08;
    },
  };
}
