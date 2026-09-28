import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Layers, Play, Pause, Camera, Sliders } from 'lucide-react';

interface ChromeToothLoopProps {
  onInspect?: () => void;
  materialFinish?: 'chrome' | 'gold' | 'obsidian' | 'porcelain';
}

export const ChromeToothLoop: React.FC<ChromeToothLoopProps> = ({
  onInspect,
  materialFinish = 'chrome',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [finish, setFinish] = useState<'chrome' | 'gold' | 'obsidian' | 'porcelain'>(materialFinish);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const toothGroupRef = useRef<THREE.Group | null>(null);
  const toothMeshRef = useRef<THREE.Mesh | null>(null);
  const envTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Helper to generate a procedural studio environment reflection map
  const createStudioEnvironmentMap = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark studio gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#1a1a24');
    bgGrad.addColorStop(0.45, '#08080c');
    bgGrad.addColorStop(0.55, '#050508');
    bgGrad.addColorStop(1, '#0e0e14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Studio Softbox 1: Bright overhead strip light (creates the iconic crown highlight in the video)
    const softboxTop = ctx.createRadialGradient(512, 100, 10, 512, 100, 220);
    softboxTop.addColorStop(0, '#ffffff');
    softboxTop.addColorStop(0.4, 'rgba(255, 255, 255, 0.9)');
    softboxTop.addColorStop(0.8, 'rgba(200, 220, 255, 0.3)');
    softboxTop.addColorStop(1, 'transparent');
    ctx.fillStyle = softboxTop;
    ctx.fillRect(200, 0, 624, 240);

    // Studio Softbox 2: Left tall vertical rim strip
    const softboxLeft = ctx.createLinearGradient(120, 0, 240, 0);
    softboxLeft.addColorStop(0, 'transparent');
    softboxLeft.addColorStop(0.5, '#ffffff');
    softboxLeft.addColorStop(1, 'transparent');
    ctx.fillStyle = softboxLeft;
    ctx.fillRect(120, 80, 120, 350);

    // Studio Softbox 3: Right warm vertical rim strip
    const softboxRight = ctx.createLinearGradient(780, 0, 900, 0);
    softboxRight.addColorStop(0, 'transparent');
    softboxRight.addColorStop(0.5, '#fff4e6');
    softboxRight.addColorStop(1, 'transparent');
    ctx.fillStyle = softboxRight;
    ctx.fillRect(780, 80, 120, 350);

    // Subtle horizon ground bounce
    const groundBounce = ctx.createLinearGradient(0, 380, 0, 512);
    groundBounce.addColorStop(0, 'transparent');
    groundBounce.addColorStop(0.7, 'rgba(240, 120, 60, 0.25)'); // Warm studio floor glow
    groundBounce.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = groundBounce;
    ctx.fillRect(0, 380, canvas.width, 132);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 580;
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 5.2);
    cameraRef.current = camera;

    // 3. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Procedural High-Contrast Environment Map
    const envTexture = createStudioEnvironmentMap();
    envTextureRef.current = envTexture;
    scene.environment = envTexture;

    // 5. Studio Key & Rim Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const topKeyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    topKeyLight.position.set(0, 8, 4);
    scene.add(topKeyLight);

    const leftRimLight = new THREE.DirectionalLight(0xecf3ff, 2.5);
    leftRimLight.position.set(-6, 2, -2);
    scene.add(leftRimLight);

    const rightWarmLight = new THREE.DirectionalLight(0xffeedd, 2.5);
    rightWarmLight.position.set(6, 2, -2);
    scene.add(rightWarmLight);

    const bottomGlow = new THREE.PointLight(0xff7733, 1.8, 8);
    bottomGlow.position.set(0, -3, 2);
    scene.add(bottomGlow);

    // 6. Sculpt anatomical molar tooth geometry
    const toothGroup = new THREE.Group();
    scene.add(toothGroup);
    toothGroupRef.current = toothGroup;

    // Base Crown Geometry with anatomical molar contours
    // High-resolution cylinder deformed organically into 4 distinct cusps & 3 roots
    const toothGeom = new THREE.CylinderGeometry(0.88, 0.62, 2.4, 64, 48);
    const pos = toothGeom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // --- CROWN ANATOMY (y > -0.2) ---
      if (y > -0.2) {
        // Occlusal Table (Top surface): 4 anatomical cusps
        if (y > 0.75) {
          const cuspHeight = Math.sin(x * 2.8) * Math.sin(z * 2.8) * 0.32;
          const centralFossa = Math.exp(-((x * x + z * z) * 3.5)) * 0.16;
          const groove = Math.abs(x * z) * 0.1;
          y += cuspHeight - centralFossa - groove;
        }

        // Bulging facial & lingual enamel contour
        const crownBulge = Math.cos(Math.max(-1, Math.min(1, y * 1.5)) * Math.PI * 0.5) * 0.15;
        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z) + crownBulge;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
      }

      // --- CERVICAL CONSTRICTION (waist between crown & roots) ---
      if (y < 0.1 && y > -0.5) {
        const factor = 0.88;
        x *= factor;
        z *= factor;
      }

      // --- ROOT SYSTEM BIFURCATION (y <= -0.4) ---
      if (y <= -0.4) {
        const rootTaper = Math.max(0.15, 1.0 - (-y - 0.4) * 0.65);
        // Split into multi-rooted branches
        const branchX = x > 0 ? 0.22 : -0.22;
        const branchZ = z > 0 ? 0.15 : -0.15;
        const separation = (-y - 0.4) * 0.35;

        x = (x + branchX * separation) * rootTaper;
        z = (z + branchZ * separation) * rootTaper;

        // Slight natural apex curve
        if (y < -1.0) {
          y -= 0.15;
          x += Math.sin(y * 2) * 0.05;
        }
      }

      pos.setXYZ(i, x, y, z);
    }
    toothGeom.computeVertexNormals();

    // Subtle contact ground shadow plane
    const shadowGeom = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.1;
    scene.add(shadowMesh);

    // Initial Material: Liquid Mirror Chrome
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.2,
      reflectivity: 1.0,
      wireframe: false,
    });

    const toothMesh = new THREE.Mesh(toothGeom, chromeMat);
    toothMesh.position.y = 0.1;
    toothMeshRef.current = toothMesh;
    toothGroup.add(toothMesh);

    // 7. Interaction: Drag & Inertia
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevX = clientX;
      prevY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !toothGroup) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      velX = dx * 0.007;
      velY = dy * 0.007;

      toothGroup.rotation.y += velX;
      toothGroup.rotation.x = Math.max(-0.4, Math.min(0.4, toothGroup.rotation.x + velY));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Observer
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // 8. 360° Continuous Smooth Rotation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (toothGroup) {
        if (!isDragging) {
          velX *= 0.94;
          velY *= 0.94;
          toothGroup.rotation.y += velX;
          toothGroup.rotation.x += velY;

          // 360-degree rotation loop matching the uploaded video speed
          if (isRotating) {
            toothGroup.rotation.y += delta * 0.85 * rotationSpeed;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      envTexture.dispose();
    };
  }, []);

  // Update Materials dynamically
  useEffect(() => {
    const mesh = toothMeshRef.current;
    if (!mesh) return;

    if (finish === 'chrome') {
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.98,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        envMapIntensity: 2.4,
        reflectivity: 1.0,
        wireframe: wireframe,
      });
    } else if (finish === 'gold') {
      mesh.material = new THREE.MeshStandardMaterial({
        color: 0xe6b44a,
        metalness: 0.95,
        roughness: 0.12,
        wireframe: wireframe,
      });
    } else if (finish === 'obsidian') {
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 0x141416,
        metalness: 0.2,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.8,
        wireframe: wireframe,
      });
    } else if (finish === 'porcelain') {
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 0xfffaf4,
        metalness: 0.02,
        roughness: 0.12,
        transmission: 0.65,
        thickness: 1.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        wireframe: wireframe,
      });
    }
  }, [finish, wireframe]);

  return (
    <div className="relative w-full h-[480px] sm:h-[550px] lg:h-[620px] flex items-center justify-center select-none">
      {/* Three.js Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      />

      {/* Control Dock (Floating at bottom) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs text-white shadow-2xl pointer-events-auto">
        {/* Play/Pause Rotation */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-full transition-colors ${
            isRotating ? 'text-[#ff9248] bg-white/10' : 'text-white/60 hover:text-white'
          }`}
          title={isRotating ? 'Pause Rotation Loop' : 'Play Rotation Loop'}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Finish Selector */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-full text-[11px]">
          <button
            onClick={() => setFinish('chrome')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              finish === 'chrome'
                ? 'bg-gradient-to-r from-slate-200 to-white text-black font-semibold shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Chrome
          </button>
          <button
            onClick={() => setFinish('gold')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              finish === 'gold'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-semibold shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            24k Gold
          </button>
          <button
            onClick={() => setFinish('obsidian')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              finish === 'obsidian'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Obsidian
          </button>
          <button
            onClick={() => setFinish('porcelain')}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              finish === 'porcelain'
                ? 'bg-[#fff5ea] text-black font-semibold shadow-sm'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Ceramic
          </button>
        </div>

        {/* Wireframe Toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            wireframe ? 'bg-[#ff9248] text-black font-semibold' : 'hover:bg-white/10 text-white/70'
          }`}
          title="Toggle Wireframe Architecture"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>

        <span className="text-white/30 text-[10px]">·</span>
        <span className="text-[11px] text-white/60 hidden sm:inline">360° Loop · Drag to orbit</span>
      </div>
    </div>
  );
};
