import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Layers, Sliders, Eye, RefreshCw, ZoomIn } from 'lucide-react';

type ModelMode = 'veneer' | 'crown' | 'implant' | 'lattice';

interface DentalCanvas3DProps {
  onOpenBooking?: () => void;
}

export const DentalCanvas3D: React.FC<DentalCanvas3DProps> = ({ onOpenBooking }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<ModelMode>('veneer');
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [translucency, setTranslucency] = useState<number>(0.85);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const activeMaterialsRef = useRef<THREE.Material[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    // 3. Renderer with physical lighting & tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights: Clinical studio setup with warm key light, cool rim light, and soft bounce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ec, 2.8);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce7f5, 1.4);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc6a87c, 3.2); // Warm champagne rim
    rimLight.position.set(0, -6, -5);
    scene.add(rimLight);

    const topSoftLight = new THREE.PointLight(0xffffff, 1.8, 15);
    topSoftLight.position.set(0, 5, 2);
    scene.add(topSoftLight);

    // 5. Model Container
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 6. Mouse / Touch Drag Interaction Handling
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !modelGroup) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      rotationVelocityX = deltaX * 0.006;
      rotationVelocityY = deltaY * 0.006;

      modelGroup.rotation.y += rotationVelocityX;
      modelGroup.rotation.x += rotationVelocityY;

      // Limit pitch to prevent awkward flipping
      modelGroup.rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, modelGroup.rotation.x));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 500);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 7. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (modelGroup) {
        if (!isDragging) {
          // Inertia damping
          rotationVelocityX *= 0.94;
          rotationVelocityY *= 0.94;
          modelGroup.rotation.y += rotationVelocityX;
          modelGroup.rotation.x += rotationVelocityY;

          // Gentle ambient auto-rotation
          if (autoRotate && !isDragging) {
            modelGroup.rotation.y += 0.005;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Re-build model geometry when activeMode, translucency, or wireframe changes
  useEffect(() => {
    const modelGroup = modelGroupRef.current;
    if (!modelGroup) return;

    // Clear previous children
    while (modelGroup.children.length > 0) {
      const child = modelGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
      modelGroup.remove(child);
    }

    activeMaterialsRef.current = [];

    // Common High-End Porcelain Material (Subsurface Scattering & Translucency)
    const createPorcelainMaterial = (tint = 0xfcfbfa) => {
      const mat = new THREE.MeshPhysicalMaterial({
        color: tint,
        emissive: 0x050608,
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transmission: translucency,
        ior: 1.54, // Natural enamel refractive index
        thickness: 1.5,
        specularIntensity: 1.2,
        specularColor: new THREE.Color(0xffffff),
        sheen: 0.4,
        sheenRoughness: 0.2,
        sheenColor: new THREE.Color(0xf5eedc), // Warm dental ceramic luster
        wireframe: wireframe,
        transparent: true,
      });
      activeMaterialsRef.current.push(mat);
      return mat;
    };

    // Titanium Surgical Grade Material
    const createTitaniumMaterial = () => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.32,
        metalness: 0.92,
        wireframe: wireframe,
      });
      activeMaterialsRef.current.push(mat);
      return mat;
    };

    // Gold / Champagne Abutment Material
    const createGoldMaterial = () => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.22,
        metalness: 0.88,
        wireframe: wireframe,
      });
      activeMaterialsRef.current.push(mat);
      return mat;
    };

    if (activeMode === 'veneer') {
      // MODE 1: Minimal-Prep 0.2mm Porcelain Veneer (Sleek Incisal Curve)
      const veneerShape = new THREE.Shape();
      veneerShape.moveTo(-1.1, -1.8);
      veneerShape.bezierCurveTo(-1.3, -0.6, -1.35, 1.2, -1.0, 1.8);
      veneerShape.bezierCurveTo(-0.4, 2.1, 0.4, 2.1, 1.0, 1.8);
      veneerShape.bezierCurveTo(1.35, 1.2, 1.3, -0.6, 1.1, -1.8);
      veneerShape.bezierCurveTo(0.6, -1.95, -0.6, -1.95, -1.1, -1.8);

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        steps: 4,
        depth: 0.25,
        bevelEnabled: true,
        bevelThickness: 0.15,
        bevelSize: 0.12,
        bevelOffset: 0,
        bevelSegments: 8,
      };

      const geometry = new THREE.ExtrudeGeometry(veneerShape, extrudeSettings);
      geometry.center();

      // Deform slightly to give natural facial curvature of an upper central incisor
      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        // Convex arch curve
        const archBend = -(x * x) * 0.18;
        const verticalBend = Math.sin(y * 0.8) * 0.08;
        pos.setZ(i, z + archBend + verticalBend);
      }
      geometry.computeVertexNormals();

      const veneerMesh = new THREE.Mesh(geometry, createPorcelainMaterial(0xfcfbf9));
      veneerMesh.scale.set(1.4, 1.4, 1.4);
      modelGroup.add(veneerMesh);

      // Inner tooth core representation (shows 0.2mm minimal prep conservation)
      const coreGeom = geometry.clone();
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xeee6d3,
        roughness: 0.45,
        metalness: 0.0,
        wireframe: wireframe,
      });
      activeMaterialsRef.current.push(coreMat);
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      coreMesh.scale.set(1.3, 1.3, 1.1);
      coreMesh.position.z = -0.3;
      modelGroup.add(coreMesh);

    } else if (activeMode === 'crown') {
      // MODE 2: Zirconia Anatomical Molar Crown (1200 MPa)
      const crownGroup = new THREE.Group();

      // Crown Body (Cusps & Occlusal Anatomy)
      const crownGeom = new THREE.CylinderGeometry(1.4, 1.1, 2.2, 32, 16);
      const pos = crownGeom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);

        // Form 4 distinct anatomical molar cusps on top surface
        if (y > 0.8) {
          const cuspHeight = Math.sin(x * 2.5) * Math.sin(z * 2.5) * 0.35;
          const groove = Math.abs(x * z) * 0.15;
          pos.setY(i, y + cuspHeight - groove);
        }
        // Cervical constriction
        if (y < -0.4) {
          const factor = 1.0 - ((-y - 0.4) * 0.25);
          pos.setX(i, x * factor);
          pos.setZ(i, z * factor);
        }
      }
      crownGeom.computeVertexNormals();

      const crownMesh = new THREE.Mesh(crownGeom, createPorcelainMaterial(0xfffdfa));
      crownGroup.add(crownMesh);

      // Anatomical Root Truncation
      const rootGeom1 = new THREE.ConeGeometry(0.5, 1.8, 20);
      const rootMesh1 = new THREE.Mesh(rootGeom1, createPorcelainMaterial(0xf5ede0));
      rootMesh1.position.set(-0.55, -1.8, 0);
      rootMesh1.rotation.z = 0.08;
      crownGroup.add(rootMesh1);

      const rootGeom2 = new THREE.ConeGeometry(0.5, 1.8, 20);
      const rootMesh2 = new THREE.Mesh(rootGeom2, createPorcelainMaterial(0xf5ede0));
      rootMesh2.position.set(0.55, -1.8, 0);
      rootMesh2.rotation.z = -0.08;
      crownGroup.add(rootMesh2);

      crownGroup.scale.set(1.2, 1.2, 1.2);
      modelGroup.add(crownGroup);

    } else if (activeMode === 'implant') {
      // MODE 3: Titanium Guided Implant System (Biocompatible Osteointegration)
      const implantGroup = new THREE.Group();

      // 1. Threaded Titanium Implant Body
      const fixtureGeom = new THREE.CylinderGeometry(0.65, 0.42, 2.6, 28, 30);
      const fixPos = fixtureGeom.attributes.position;
      for (let i = 0; i < fixPos.count; i++) {
        const y = fixPos.getY(i);
        const angle = Math.atan2(fixPos.getZ(i), fixPos.getX(i));
        // Add helical screw thread ridges
        const thread = Math.sin(y * 14.0 + angle * 2.0) * 0.07;
        const radius = Math.sqrt(fixPos.getX(i) ** 2 + fixPos.getZ(i) ** 2);
        const newRadius = radius + thread;
        fixPos.setX(i, Math.cos(angle) * newRadius);
        fixPos.setZ(i, Math.sin(angle) * newRadius);
      }
      fixtureGeom.computeVertexNormals();
      const fixtureMesh = new THREE.Mesh(fixtureGeom, createTitaniumMaterial());
      fixtureMesh.position.y = -1.2;
      implantGroup.add(fixtureMesh);

      // 2. Gold / Titanium Precision Abutment
      const abutmentGeom = new THREE.CylinderGeometry(0.85, 0.65, 0.9, 28);
      const abutmentMesh = new THREE.Mesh(abutmentGeom, createGoldMaterial());
      abutmentMesh.position.y = 0.35;
      implantGroup.add(abutmentMesh);

      // 3. Ceramic Crown Restored Over Abutment
      const crownGeom = new THREE.CylinderGeometry(1.1, 0.85, 1.6, 28);
      const crownPos = crownGeom.attributes.position;
      for (let i = 0; i < crownPos.count; i++) {
        const y = crownPos.getY(i);
        if (y > 0.5) {
          const x = crownPos.getX(i);
          const z = crownPos.getZ(i);
          crownPos.setY(i, y + Math.sin(x * 3) * Math.cos(z * 3) * 0.2);
        }
      }
      crownGeom.computeVertexNormals();
      const crownMesh = new THREE.Mesh(crownGeom, createPorcelainMaterial(0xfefefe));
      crownMesh.position.y = 1.45;
      implantGroup.add(crownMesh);

      implantGroup.scale.set(1.1, 1.1, 1.1);
      modelGroup.add(implantGroup);

    } else if (activeMode === 'lattice') {
      // MODE 4: Enamel Micro-Crystalline Lattice & Stress Wireframe
      const latticeGeom = new THREE.IcosahedronGeometry(1.8, 3);
      const wireMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        wireframe: true,
        roughness: 0.1,
      });
      activeMaterialsRef.current.push(wireMat);
      const wireMesh = new THREE.Mesh(latticeGeom, wireMat);
      modelGroup.add(wireMesh);

      // Inner Core
      const coreGeom = new THREE.SphereGeometry(1.1, 24, 24);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0xc6a87c,
        emissive: 0x382810,
        roughness: 0.2,
        transmission: 0.7,
        thickness: 2.0,
      });
      activeMaterialsRef.current.push(coreMat);
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      modelGroup.add(coreMesh);
    }

  }, [activeMode, translucency, wireframe]);

  const resetView = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[550px] lg:h-[650px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b0e17] via-[#08090d] to-[#06070a] border border-white/10 shadow-2xl flex flex-col">
      {/* Top Header / Mode Switcher */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-[#101420]/90 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveMode('veneer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'veneer'
                ? 'bg-[#c6a87c] text-[#07080b] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            0.2mm Porcelain Veneer
          </button>
          <button
            onClick={() => setActiveMode('crown')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'crown'
                ? 'bg-[#c6a87c] text-[#07080b] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Zirconia Crown (1200 MPa)
          </button>
          <button
            onClick={() => setActiveMode('implant')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'implant'
                ? 'bg-[#c6a87c] text-[#07080b] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Titanium Implant System
          </button>
          <button
            onClick={() => setActiveMode('lattice')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'lattice'
                ? 'bg-[#c6a87c] text-[#07080b] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Enamel Matrix
          </button>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 backdrop-blur-md transition-colors ${
              autoRotate
                ? 'bg-[#c6a87c]/15 border-[#c6a87c]/40 text-[#c6a87c]'
                : 'bg-[#101420]/80 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 backdrop-blur-md transition-colors ${
              wireframe
                ? 'bg-[#38bdf8]/15 border-[#38bdf8]/40 text-[#38bdf8]'
                : 'bg-[#101420]/80 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Wireframe Architecture"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Wireframe</span>
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-lg border border-white/10 bg-[#101420]/80 text-slate-300 hover:text-white text-xs backdrop-blur-md transition-colors"
            title="Reset Orientation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing touch-none select-none relative"
      />

      {/* Interactive Bottom Control Dock */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Real-time Material Spec Sheet */}
        <div className="bg-[#0e121d]/90 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[#c6a87c] font-semibold uppercase tracking-wider">
              {activeMode === 'veneer' && 'Feldspathic Enamel Veneer'}
              {activeMode === 'crown' && 'Monolithic High-Strength Zirconia'}
              {activeMode === 'implant' && 'Grade-5 Titanium Osteointegrated Fixture'}
              {activeMode === 'lattice' && 'Biomimetic Hydroxyapatite Lattice'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span>
              Prep Margin: <strong className="text-white font-mono-numbers">0.2mm</strong>
            </span>
            <span className="text-slate-600">·</span>
            <span>
              Translucency: <strong className="text-white font-mono-numbers">{Math.round(translucency * 100)}%</strong>
            </span>
            <span className="text-slate-600">·</span>
            <span>
              Bio-Fit: <strong className="text-emerald-400 font-mono-numbers">99.8%</strong>
            </span>
          </div>
        </div>

        {/* Translucency Slider Control */}
        <div className="flex items-center gap-3 bg-[#0e121d]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#c6a87c]" />
          <span className="text-slate-300 whitespace-nowrap">Ceramic Translucency</span>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={translucency}
            onChange={(e) => setTranslucency(parseFloat(e.target.value))}
            className="w-24 accent-[#c6a87c] cursor-pointer"
          />
        </div>

        {/* Action Button */}
        {onOpenBooking && (
          <button
            onClick={onOpenBooking}
            className="px-4 py-2.5 text-xs font-semibold bg-[#c6a87c] hover:bg-[#d8bc92] text-[#07080b] rounded-xl transition-all shadow-lg hover:shadow-[#c6a87c]/20"
          >
            Consult On This Restoration
          </button>
        )}
      </div>

      {/* Drag Hint Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-[11px] text-slate-400 flex items-center gap-2">
        <RotateCw className="w-3.5 h-3.5 animate-spin" />
        <span>Drag to rotate 3D anatomy</span>
      </div>
    </div>
  );
};
