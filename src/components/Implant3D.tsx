import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Layers, Sliders } from 'lucide-react';

interface Implant3DProps {
  onInspect?: () => void;
}

export const Implant3D: React.FC<Implant3DProps> = ({ onInspect }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<'all' | 'crown' | 'fixture'>('all');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const implantGroupRef = useRef<THREE.Group | null>(null);
  const crownMeshRef = useRef<THREE.Mesh | null>(null);
  const fixtureGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 550;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.2);
    cameraRef.current = camera;

    // 3. Renderer with soft physical tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting matching the warm terracotta studio backdrop in the image
    // Ambient light with warm amber tone
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.2);
    scene.add(ambientLight);

    // Key Light from top-front
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    // Warm terracotta fill from left
    const warmFill = new THREE.DirectionalLight(0xec5b24, 2.2);
    warmFill.position.set(-4, 1, 2);
    scene.add(warmFill);

    // Internal Subsurface Crown Glow Light (underneath the crown collar as seen in reference image!)
    const internalGlow = new THREE.PointLight(0xffaa33, 4.5, 3.5);
    internalGlow.position.set(0, 0.35, 0);
    scene.add(internalGlow);

    // Rim light from behind to highlight screw threads
    const rimLight = new THREE.DirectionalLight(0xffc58d, 2.8);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    // 5. Build the Exact Anatomical Implant Group
    const implantGroup = new THREE.Group();
    scene.add(implantGroup);
    implantGroupRef.current = implantGroup;

    // --- A. The Translucent Porcelain Crown ---
    // Smooth organic molar crown with anatomical cusps
    const crownGeom = new THREE.CylinderGeometry(0.72, 0.52, 1.15, 48, 32);
    const cPos = crownGeom.attributes.position;
    for (let i = 0; i < cPos.count; i++) {
      const x = cPos.getX(i);
      const y = cPos.getY(i);
      const z = cPos.getZ(i);

      // Occlusal cusps and soft rounded curves
      if (y > 0.2) {
        const cusp1 = Math.sin(x * 2.8) * Math.sin(z * 2.8) * 0.22;
        const dip = Math.exp(-((x * x + z * z) * 4.0)) * 0.12;
        cPos.setY(i, y + cusp1 - dip);
      }

      // Smooth bulging organic facial contour
      if (y > -0.3 && y < 0.3) {
        const bulge = Math.cos(y * Math.PI) * 0.08;
        const angle = Math.atan2(z, x);
        const radius = Math.sqrt(x * x + z * z) + bulge;
        cPos.setX(i, Math.cos(angle) * radius);
        cPos.setZ(i, Math.sin(angle) * radius);
      }
    }
    crownGeom.computeVertexNormals();

    const crownMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffcf7,
      emissive: 0x221105,
      roughness: 0.14,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transmission: 0.65, // Translucent porcelain ceramic
      thickness: 1.8,
      ior: 1.53,
      specularIntensity: 1.4,
      sheen: 0.5,
      sheenColor: new THREE.Color(0xffeedd),
    });

    const crownMesh = new THREE.Mesh(crownGeom, crownMat);
    crownMesh.position.y = 0.95;
    crownMeshRef.current = crownMesh;
    implantGroup.add(crownMesh);

    // --- B. The Polished Collar / Abutment Ring ---
    const collarGeom = new THREE.CylinderGeometry(0.53, 0.48, 0.28, 48);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f22,
      roughness: 0.25,
      metalness: 0.85,
    });
    const collarMesh = new THREE.Mesh(collarGeom, collarMat);
    collarMesh.position.y = 0.32;
    implantGroup.add(collarMesh);

    // Glowing internal accent ring between crown and collar
    const glowRingGeom = new THREE.TorusGeometry(0.51, 0.03, 16, 48);
    glowRingGeom.rotateX(Math.PI / 2);
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xffa500,
    });
    const glowRingMesh = new THREE.Mesh(glowRingGeom, glowRingMat);
    glowRingMesh.position.y = 0.44;
    implantGroup.add(glowRingMesh);

    // --- C. Threaded Titanium Screw Fixture ---
    const fixtureGroup = new THREE.Group();
    fixtureGroupRef.current = fixtureGroup;

    // Tapered cylindrical core
    const fixtureCoreGeom = new THREE.CylinderGeometry(0.46, 0.24, 2.1, 40, 60);
    const fPos = fixtureCoreGeom.attributes.position;
    for (let i = 0; i < fPos.count; i++) {
      const y = fPos.getY(i);
      const angle = Math.atan2(fPos.getZ(i), fPos.getX(i));
      // Continuous helical micro-thread
      const threadDepth = 0.045 * (1.0 - Math.abs(y / 1.3));
      const thread = Math.sin(y * 22.0 + angle * 1.5) * threadDepth;
      const radius = Math.sqrt(fPos.getX(i) ** 2 + fPos.getZ(i) ** 2) + Math.max(0, thread);
      fPos.setX(i, Math.cos(angle) * radius);
      fPos.setZ(i, Math.sin(angle) * radius);
    }
    fixtureCoreGeom.computeVertexNormals();

    // Dark bronze / titanium gunmetal material matching the screenshot
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x3d352e, // Warm metallic bronze/titanium
      roughness: 0.35,
      metalness: 0.85,
    });

    const fixtureMesh = new THREE.Mesh(fixtureCoreGeom, titaniumMat);
    fixtureMesh.position.y = -0.85;
    fixtureGroup.add(fixtureMesh);

    // Rounded apex at the bottom
    const apexGeom = new THREE.SphereGeometry(0.24, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const apexMesh = new THREE.Mesh(apexGeom, titaniumMat);
    apexMesh.position.y = -1.9;
    apexMesh.rotation.x = Math.PI;
    fixtureGroup.add(apexMesh);

    implantGroup.add(fixtureGroup);

    // Slight initial tilt for dynamic aesthetic angle
    implantGroup.rotation.y = 0.2;
    implantGroup.position.y = -0.15;

    // --- 6. Interaction: Mouse Drag and Parallax ---
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
      if (!isDragging || !implantGroup) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - prevX;
      const dy = clientY - prevY;

      velX = dx * 0.007;
      velY = dy * 0.007;

      implantGroup.rotation.y += velX;
      implantGroup.rotation.x = Math.max(-0.4, Math.min(0.4, implantGroup.rotation.x + velY));

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

    // Resize Handler
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // --- 7. Animation Loop with Subtle Breathing Motion ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (implantGroup) {
        if (!isDragging) {
          velX *= 0.93;
          velY *= 0.93;
          implantGroup.rotation.y += velX;
          implantGroup.rotation.x += velY;

          // Gentle ambient float
          if (isRotating) {
            implantGroup.rotation.y += 0.006;
          }
          implantGroup.position.y = -0.15 + Math.sin(elapsedTime * 1.5) * 0.04;
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
    };
  }, [isRotating]);

  // Wireframe toggle
  useEffect(() => {
    if (!crownMeshRef.current || !fixtureGroupRef.current) return;
    const crownMat = crownMeshRef.current.material as THREE.MeshPhysicalMaterial;
    if (crownMat) crownMat.wireframe = wireframe;

    fixtureGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        (child.material as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[620px] flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none flex items-center justify-center"
      />

      {/* Interactive Micro Controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#2d0e06]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/80 shadow-xl pointer-events-auto">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-full transition-colors ${
            isRotating ? 'text-[#ff9248] bg-white/10' : 'text-white/60 hover:text-white'
          }`}
          title="Toggle Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            wireframe ? 'bg-[#ff9248] text-[#2b0c05] font-semibold' : 'hover:bg-white/10 text-white/80'
          }`}
        >
          {wireframe ? 'Solid Model' : 'Wireframe'}
        </button>

        <span className="text-white/30 text-[10px]">·</span>
        <span className="text-[11px] text-white/70 hidden sm:inline">Drag to inspect 360°</span>
      </div>
    </div>
  );
};
