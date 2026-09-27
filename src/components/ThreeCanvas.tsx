import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CameraPreset } from '../types';
import { audioService } from '../services/audioService';

interface ThreeCanvasProps {
  cameraPreset: CameraPreset;
  wireframe: boolean;
  rotationSpeed: number;
  onLoaded?: () => void;
  activeConsoleScreen?: string;
  activeDataStream?: string;
}

export default function ThreeCanvas({
  cameraPreset,
  wireframe,
  rotationSpeed,
  onLoaded,
  activeConsoleScreen,
  activeDataStream,
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    stationGroup: THREE.Group;
    outerRing: THREE.Group;
    innerRing: THREE.Group;
    reactorCore: THREE.Mesh;
    coreLight: THREE.PointLight;
    gallerySpots: THREE.SpotLight[];
    crystals: THREE.Mesh[];
    materials: THREE.Material[];
    targetCamPos: THREE.Vector3;
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
    mouse: { x: number; y: number; targetX: number; targetY: number };
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    manualRotation: { x: number; y: number };
    clock: THREE.Clock;
    frameId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020308);
    scene.fog = new THREE.FogExp2(0x020308, 0.005);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1200);
    // Slightly elevated, close-up gallery viewpoint
    camera.position.set(11, 7.5, 17);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const materials: THREE.Material[] = [];

    // --- Procedural Canvas Textures ---
    const createPlaqueTexture = (text: string, sub: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      // Brushed dark bronze / copper metal plaque
      const grad = ctx.createLinearGradient(0, 0, 512, 128);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#451a03');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 128);

      // Metallic border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 116);

      // Engraved typography
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(text, 256, 62);

      ctx.fillStyle = '#fde68a';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(sub, 256, 96);

      return new THREE.CanvasTexture(canvas);
    };

    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(245, 208, 140, 0.9)');
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const createMultiColorNebulaTexture = (hueType: 'copper' | 'amethyst' | 'teal') => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);

      if (hueType === 'copper') {
        gradient.addColorStop(0, 'rgba(234, 88, 12, 0.65)');
        gradient.addColorStop(0.35, 'rgba(180, 83, 9, 0.35)');
        gradient.addColorStop(0.7, 'rgba(120, 53, 15, 0.12)');
      } else if (hueType === 'amethyst') {
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.6)');
        gradient.addColorStop(0.4, 'rgba(126, 34, 206, 0.3)');
        gradient.addColorStop(0.8, 'rgba(76, 29, 149, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(20, 184, 166, 0.55)');
        gradient.addColorStop(0.4, 'rgba(14, 116, 144, 0.28)');
        gradient.addColorStop(0.8, 'rgba(15, 23, 42, 0.08)');
      }
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(canvas);
    };

    // --- 2. Exhibition Gallery Floor with Integrated Light Lines ---
    const floorGeo = new THREE.PlaneGeometry(120, 120, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.18,
      metalness: 0.85,
    });
    materials.push(floorMat);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -11.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Light lines integrated in polished concrete gallery floor
    const lightLineGroup = new THREE.Group();
    const lineMatCyan = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const lineMatCopper = new THREE.MeshBasicMaterial({ color: 0xd97706 });
    materials.push(lineMatCyan, lineMatCopper);

    for (let x = -28; x <= 28; x += 14) {
      const lineGeo = new THREE.BoxGeometry(0.12, 0.02, 70);
      const lineMesh = new THREE.Mesh(lineGeo, x === 0 ? lineMatCopper : lineMatCyan);
      lineMesh.position.set(x, -11.48, 0);
      lightLineGroup.add(lineMesh);
    }
    for (let z = -25; z <= 25; z += 12.5) {
      const lineGeo = new THREE.BoxGeometry(60, 0.02, 0.12);
      const lineMesh = new THREE.Mesh(lineGeo, lineMatCyan);
      lineMesh.position.set(0, -11.48, z);
      lightLineGroup.add(lineMesh);
    }
    scene.add(lightLineGroup);

    // --- 3. Distant Space Environment with Multi-Colored Nebulae & Earth ---
    // Distant photorealistic Earth sphere with glowing blue atmospheric halo
    const earthGroup = new THREE.Group();
    const earthGeo = new THREE.SphereGeometry(14, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.45,
      metalness: 0.1,
      emissive: 0x0369a1,
      emissiveIntensity: 0.22,
    });
    materials.push(earthMat);
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // Earth cloud layer
    const cloudGeo = new THREE.SphereGeometry(14.2, 48, 48);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.8,
    });
    materials.push(cloudMat);
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // Atmosphere Rim Glow
    const haloGeo = new THREE.SphereGeometry(15.2, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    materials.push(haloMat);
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    earthGroup.add(haloMesh);

    earthGroup.position.set(-65, -12, -90);
    scene.add(earthGroup);

    // Multi-Colored Cosmic Starfield
    const starCount = 3400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const r = 160 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);

      const paletteRoll = Math.random();
      if (paletteRoll > 0.65) {
        // Copper / Gold tint
        starColors[i * 3] = 1.0;
        starColors[i * 3 + 1] = 0.78;
        starColors[i * 3 + 2] = 0.45;
      } else if (paletteRoll > 0.35) {
        // Amethyst / Purple tint
        starColors[i * 3] = 0.85;
        starColors[i * 3 + 1] = 0.55;
        starColors[i * 3 + 2] = 1.0;
      } else {
        // Crisp Stellar Cyan
        starColors[i * 3] = 0.55;
        starColors[i * 3 + 1] = 0.88;
        starColors[i * 3 + 2] = 1.0;
      }
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.4,
      map: createStarTexture(),
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(starMat);
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Multi-Colored Nebula Clouds: Copper, Amethyst, and Teal
    const createNebulaCloud = (type: 'copper' | 'amethyst' | 'teal', count: number, centerAngle: number, radiusBase: number) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const ang = centerAngle + (Math.random() - 0.5) * 1.8;
        const rad = radiusBase + (Math.random() - 0.5) * 45;
        const h = (Math.random() - 0.5) * 85;
        pos[i * 3] = Math.cos(ang) * rad + (Math.random() - 0.5) * 35;
        pos[i * 3 + 1] = h;
        pos[i * 3 + 2] = Math.sin(ang) * rad + (Math.random() - 0.5) * 35;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        size: 55,
        map: createMultiColorNebulaTexture(type),
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      materials.push(mat);
      return new THREE.Points(geo, mat);
    };

    const copperNebula = createNebulaCloud('copper', 280, 0.4, 95);
    const amethystNebula = createNebulaCloud('amethyst', 280, 2.6, 110);
    const tealNebula = createNebulaCloud('teal', 280, 4.8, 100);
    scene.add(copperNebula, amethystNebula, tealNebula);

    // --- 4. Museum-Quality Gallery Multi-Point LED Lighting Setup ---
    // A. Warm Gallery Spotlight (Golden-Amber 3200K) on the copper & bronze station
    const warmGallerySpot = new THREE.SpotLight(0xf59e0b, 5.5, 45, Math.PI / 4.5, 0.4, 1.2);
    warmGallerySpot.position.set(16, 20, 18);
    warmGallerySpot.target.position.set(0, 0, 0);
    warmGallerySpot.castShadow = true;
    scene.add(warmGallerySpot);
    scene.add(warmGallerySpot.target);

    // B. Cool Gallery Accent Spotlight (Cyan 5500K)
    const coolGallerySpot = new THREE.SpotLight(0x06b6d4, 4.2, 50, Math.PI / 4, 0.5, 1.4);
    coolGallerySpot.position.set(-18, 18, 14);
    coolGallerySpot.target.position.set(0, 0, 0);
    scene.add(coolGallerySpot);
    scene.add(coolGallerySpot.target);

    // C. Amethyst Rim Spotlight
    const amethystGallerySpot = new THREE.SpotLight(0xa855f7, 3.8, 50, Math.PI / 3.5, 0.6, 1.5);
    amethystGallerySpot.position.set(0, -5, -25);
    amethystGallerySpot.target.position.set(0, 0, 0);
    scene.add(amethystGallerySpot);
    scene.add(amethystGallerySpot.target);

    // Gallery Soft Ambient Fill
    const galleryAmbient = new THREE.AmbientLight(0x131a2a, 1.1);
    scene.add(galleryAmbient);

    // Station Tokamak Core Light
    const coreLight = new THREE.PointLight(0xf59e0b, 5.0, 25);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // --- 5. CENTERPIECE: The Colossal "ASTRA-1" Orbital Megastructure ---
    const stationGroup = new THREE.Group();

    // High-End PBR Materials: Aged Copper, Polished Bronze, Titanium, Photovoltaics
    const agedCopperMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.36,
      metalness: 0.88,
    });
    const polishedBronzeMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.22,
      metalness: 0.94,
    });
    const titaniumHullMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.28,
      metalness: 0.96,
    });
    const darkTrussMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.85,
    });
    const goldTrussMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.2,
      metalness: 0.9,
    });
    // Multi-colored iridescent solar panel material
    const solarArrayMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.12,
      metalness: 0.75,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const solarArrayCopperMat = new THREE.MeshStandardMaterial({
      color: 0x7c2d12,
      roughness: 0.15,
      metalness: 0.8,
      emissive: 0xb45309,
      emissiveIntensity: 0.25,
    });
    const cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const amberCoreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf97316,
      emissiveIntensity: 2.2,
      roughness: 0.1,
    });

    materials.push(
      agedCopperMat,
      polishedBronzeMat,
      titaniumHullMat,
      darkTrussMat,
      goldTrussMat,
      solarArrayMat,
      solarArrayCopperMat,
      cyanGlowMat,
      amberCoreMat,
    );

    // A. Main Titanium & Copper Spine Cylinder
    const spineGeo = new THREE.CylinderGeometry(1.3, 1.3, 17, 36);
    const spineMesh = new THREE.Mesh(spineGeo, titaniumHullMat);
    spineMesh.castShadow = true;
    stationGroup.add(spineMesh);

    // Ribbed aged copper armor plating rings along spine
    for (let y = -6.5; y <= 6.5; y += 2.2) {
      const ringGeo = new THREE.TorusGeometry(1.48, 0.16, 16, 36);
      const ringMesh = new THREE.Mesh(ringGeo, agedCopperMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = y;
      ringMesh.castShadow = true;
      stationGroup.add(ringMesh);
    }

    // Physical Etched Metal Nameplate Plaque: "ASTRA-1"
    const plaqueMat = new THREE.MeshBasicMaterial({
      map: createPlaqueTexture('ASTRA-1', 'ORBITAL STATION · ARCH-01'),
    });
    materials.push(plaqueMat);
    const plaqueGeo = new THREE.BoxGeometry(2.0, 0.6, 0.1);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, 3.2, 1.55);
    stationGroup.add(plaqueMesh);

    // Forward Observation Cupola (Bronze & Titanium dome with illuminated viewport slots)
    const cupolaGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupolaMesh = new THREE.Mesh(cupolaGeo, polishedBronzeMat);
    cupolaMesh.position.y = 8.5;
    stationGroup.add(cupolaMesh);

    const windowRingGeo = new THREE.TorusGeometry(1.35, 0.08, 16, 32);
    const windowRing = new THREE.Mesh(windowRingGeo, cyanGlowMat);
    windowRing.rotation.x = Math.PI / 2;
    windowRing.position.y = 9.2;
    stationGroup.add(windowRing);

    // Multi-tier Telemetry Antenna Mast
    const mastGeo = new THREE.CylinderGeometry(0.12, 0.12, 4, 16);
    const mast = new THREE.Mesh(mastGeo, titaniumHullMat);
    mast.position.y = 11.2;
    stationGroup.add(mast);

    const dishGeo = new THREE.ConeGeometry(1.8, 0.7, 32, 1, true);
    const dish = new THREE.Mesh(dishGeo, polishedBronzeMat);
    dish.position.set(0.8, 12.8, 0);
    dish.rotation.z = Math.PI / 3.4;
    dish.rotation.y = Math.PI / 4;
    stationGroup.add(dish);

    // B. Outer Counter-Rotating Habitat Torus in Polished Bronze & Aged Copper
    const outerRing = new THREE.Group();
    const outerTorusGeo = new THREE.TorusGeometry(6.6, 0.6, 24, 72);
    const outerTorusMesh = new THREE.Mesh(outerTorusGeo, polishedBronzeMat);
    outerTorusMesh.rotation.x = Math.PI / 2;
    outerTorusMesh.castShadow = true;
    outerRing.add(outerTorusMesh);

    const outerWindowGeo = new THREE.TorusGeometry(6.6, 0.63, 10, 54);
    const outerWindowMesh = new THREE.Mesh(outerWindowGeo, cyanGlowMat);
    outerWindowMesh.rotation.x = Math.PI / 2;
    outerRing.add(outerWindowMesh);

    // 4 Aged Copper Structural Spokes
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const spokeGeo = new THREE.CylinderGeometry(0.2, 0.2, 6.6, 16);
      const spoke = new THREE.Mesh(spokeGeo, agedCopperMat);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = angle;
      spoke.position.set((Math.cos(angle) * 6.6) / 2, 0, (Math.sin(angle) * 6.6) / 2);
      outerRing.add(spoke);
    }
    outerRing.position.y = 1.8;
    stationGroup.add(outerRing);

    // C. Inner Counter-Rotating Centrifuge Ring in Titanium & Gold
    const innerRing = new THREE.Group();
    const innerTorusGeo = new THREE.TorusGeometry(4.4, 0.42, 20, 56);
    const innerTorusMesh = new THREE.Mesh(innerTorusGeo, titaniumHullMat);
    innerTorusMesh.rotation.x = Math.PI / 2;
    innerTorusMesh.castShadow = true;
    innerRing.add(innerTorusMesh);

    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3;
      const spokeGeo = new THREE.CylinderGeometry(0.16, 0.16, 4.4, 16);
      const spoke = new THREE.Mesh(spokeGeo, goldTrussMat);
      spoke.rotation.z = Math.PI / 2;
      spoke.rotation.y = angle;
      spoke.position.set((Math.cos(angle) * 4.4) / 2, 0, (Math.sin(angle) * 4.4) / 2);
      innerRing.add(spoke);
    }
    innerRing.position.y = -1.8;
    stationGroup.add(innerRing);

    // D. Fusion Reactor Tokamak Core with Pulsing Amber Glow
    const reactorHousingGeo = new THREE.TorusGeometry(2.3, 0.4, 20, 36);
    const reactorHousing = new THREE.Mesh(reactorHousingGeo, agedCopperMat);
    reactorHousing.rotation.x = Math.PI / 2;
    stationGroup.add(reactorHousing);

    const reactorCoreGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const reactorCore = new THREE.Mesh(reactorCoreGeo, amberCoreMat);
    stationGroup.add(reactorCore);

    // E. Massive Multi-Colored Solar Array Wings (Alternating Bronze & Cobalt Panels)
    const createArticulatedSolarWing = (isLeft: boolean, zOffset: number) => {
      const wingGroup = new THREE.Group();
      const boomLength = 10.2;
      const boomGeo = new THREE.BoxGeometry(boomLength, 0.28, 0.28);
      const boom = new THREE.Mesh(boomGeo, goldTrussMat);
      boom.position.x = isLeft ? -boomLength / 2 - 1.3 : boomLength / 2 + 1.3;
      wingGroup.add(boom);

      for (let p = 0; p < 4; p++) {
        const xPos = isLeft ? -3.2 - p * 2.25 : 3.2 + p * 2.25;
        // Alternating panel colors for rich multi-color palette
        const mat = p % 2 === 0 ? solarArrayMat : solarArrayCopperMat;
        const panelGeo = new THREE.BoxGeometry(2.0, 3.4, 0.08);
        const panelMesh = new THREE.Mesh(panelGeo, mat);
        panelMesh.position.set(xPos, 0, 0);

        const edgeGeo = new THREE.BoxGeometry(2.06, 3.46, 0.04);
        const edgeMesh = new THREE.Mesh(edgeGeo, titaniumHullMat);
        edgeMesh.position.set(xPos, 0, -0.02);

        wingGroup.add(edgeMesh, panelMesh);
      }
      wingGroup.position.set(0, -4.2, zOffset);
      return wingGroup;
    };

    stationGroup.add(createArticulatedSolarWing(true, 1.4));
    stationGroup.add(createArticulatedSolarWing(false, 1.4));
    stationGroup.add(createArticulatedSolarWing(true, -1.4));
    stationGroup.add(createArticulatedSolarWing(false, -1.4));

    // F. Plasma Propulsion Engine Bells
    const engineMountGeo = new THREE.CylinderGeometry(1.3, 1.7, 2.4, 24);
    const engineMount = new THREE.Mesh(engineMountGeo, titaniumHullMat);
    engineMount.position.y = -9.6;
    stationGroup.add(engineMount);

    for (let b = 0; b < 3; b++) {
      const angle = (b * 2 * Math.PI) / 3;
      const bellGeo = new THREE.ConeGeometry(0.75, 1.8, 24, 1, true);
      const bellMesh = new THREE.Mesh(bellGeo, polishedBronzeMat);
      bellMesh.position.set(Math.cos(angle) * 0.75, -11.2, Math.sin(angle) * 0.75);
      stationGroup.add(bellMesh);
    }

    // Ion Plasma Glow Exhaust
    const plumeGeo = new THREE.ConeGeometry(1.3, 4.8, 24);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    materials.push(plumeMat);
    const thrusterGlow = new THREE.Mesh(plumeGeo, plumeMat);
    thrusterGlow.position.y = -13.2;
    stationGroup.add(thrusterGlow);

    stationGroup.rotation.z = 0.25;
    stationGroup.rotation.x = 0.32;
    scene.add(stationGroup);

    // --- 6. FOREGROUND EXHIBITION DIORAMA PODIUMS & FLEET MODELS ---
    // A. Physical Textured Platforms: Copper & Rich Purple Pedestals
    const platformGroup = new THREE.Group();
    const copperPodiumMat = new THREE.MeshStandardMaterial({
      color: 0x9a3412,
      roughness: 0.3,
      metalness: 0.85,
    });
    const purplePodiumMat = new THREE.MeshStandardMaterial({
      color: 0x581c87,
      roughness: 0.35,
      metalness: 0.8,
    });
    materials.push(copperPodiumMat, purplePodiumMat);

    // Row 1 & Row 2 Fleet Miniatures on Pedestals
    const fleetMiniatures = [
      { name: 'ORION SCOUT', x: -10, y: -7.5, z: 7, tone: 'copper', shape: 'dart' },
      { name: 'ATLAS CARGO', x: -6, y: -7.8, z: 8.5, tone: 'purple', shape: 'box' },
      { name: 'NEBULA MINER', x: -2, y: -8.0, z: 9.5, tone: 'copper', shape: 'drill' },
      { name: 'RECLAIMER', x: 2, y: -8.0, z: 9.5, tone: 'purple', shape: 'claw' },
      { name: 'VOYAGER EXPLORER', x: 6, y: -7.8, z: 8.5, tone: 'copper', shape: 'ring' },
      { name: 'LUNA ROVER', x: 10, y: -7.5, z: 7, tone: 'purple', shape: 'crawler' },
    ];

    fleetMiniatures.forEach((fleet) => {
      const plinth = new THREE.Group();
      // Pedestal base
      const baseGeo = new THREE.CylinderGeometry(0.9, 1.1, 0.4, 24);
      const baseMesh = new THREE.Mesh(
        baseGeo,
        fleet.tone === 'copper' ? copperPodiumMat : purplePodiumMat,
      );
      baseMesh.castShadow = true;
      plinth.add(baseMesh);

      // Nameplate plaque on pedestal
      const plateGeo = new THREE.BoxGeometry(0.8, 0.2, 0.05);
      const plateMesh = new THREE.Mesh(plateGeo, goldTrussMat);
      plateMesh.position.set(0, 0.1, 1.05);
      plinth.add(plateMesh);

      // Miniature craft model on stanchion
      const stanchionGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 12);
      const stanchion = new THREE.Mesh(stanchionGeo, titaniumHullMat);
      stanchion.position.y = 0.55;
      plinth.add(stanchion);

      let craft: THREE.Object3D;
      if (fleet.shape === 'dart') {
        const cGeo = new THREE.ConeGeometry(0.35, 1.2, 16);
        craft = new THREE.Mesh(cGeo, polishedBronzeMat);
        craft.rotation.x = Math.PI / 2;
      } else if (fleet.shape === 'box') {
        const cGeo = new THREE.BoxGeometry(0.7, 0.45, 1.2);
        craft = new THREE.Mesh(cGeo, titaniumHullMat);
      } else if (fleet.shape === 'drill') {
        const cGeo = new THREE.CylinderGeometry(0.15, 0.45, 1.1, 16);
        craft = new THREE.Mesh(cGeo, agedCopperMat);
        craft.rotation.x = Math.PI / 2;
      } else if (fleet.shape === 'claw') {
        const cGeo = new THREE.TorusGeometry(0.4, 0.12, 12, 24);
        craft = new THREE.Mesh(cGeo, goldTrussMat);
      } else if (fleet.shape === 'ring') {
        const cGeo = new THREE.TorusGeometry(0.45, 0.1, 16, 32);
        craft = new THREE.Mesh(cGeo, polishedBronzeMat);
      } else {
        const cGeo = new THREE.BoxGeometry(0.8, 0.35, 0.9);
        craft = new THREE.Mesh(cGeo, titaniumHullMat);
      }
      craft.position.y = 1.0;
      plinth.add(craft);

      plinth.position.set(fleet.x, fleet.y, fleet.z);
      platformGroup.add(plinth);
    });
    scene.add(platformGroup);

    // --- 7. BOTTOM CENTER: Integrated Glowing Crystalline Data Hubs ---
    const crystalGroup = new THREE.Group();
    const crystalHues = [0x06b6d4, 0xa855f7, 0x10b981];
    const crystals: THREE.Mesh[] = [];

    crystalHues.forEach((hue, idx) => {
      const crystalPlinth = new THREE.Group();
      // Octahedron facet crystal
      const octGeo = new THREE.OctahedronGeometry(0.55, 0);
      const octMat = new THREE.MeshStandardMaterial({
        color: hue,
        emissive: hue,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88,
      });
      materials.push(octMat);
      const crystalMesh = new THREE.Mesh(octGeo, octMat);
      crystalMesh.position.y = 0.8;
      crystalMesh.castShadow = true;
      crystalPlinth.add(crystalMesh);
      crystals.push(crystalMesh);

      // Light beam / stanchion
      const stemGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.8, 16);
      const stemMesh = new THREE.Mesh(stemGeo, goldTrussMat);
      stemMesh.position.y = 0.3;
      crystalPlinth.add(stemMesh);

      const xOffset = (idx - 1) * 3.4;
      crystalPlinth.position.set(xOffset, -8.6, 11);
      crystalGroup.add(crystalPlinth);
    });
    scene.add(crystalGroup);

    // --- 8. BOTTOM RIGHT: Interactive Console 3D Physical Mockup ---
    const consoleStand = new THREE.Group();
    const consoleGeo = new THREE.BoxGeometry(4.2, 1.8, 2.2);
    const consoleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.85,
    });
    materials.push(consoleMat);
    const consoleBase = new THREE.Mesh(consoleGeo, consoleMat);
    consoleBase.rotation.x = -0.3;
    consoleStand.add(consoleBase);

    // 3 Screen bezels (Blue, Green, Purple)
    const screenColors = [0x38bdf8, 0x34d399, 0xc084fc];
    screenColors.forEach((sColor, sIdx) => {
      const sGeo = new THREE.PlaneGeometry(1.0, 0.7);
      const sMat = new THREE.MeshBasicMaterial({ color: sColor });
      materials.push(sMat);
      const screenMesh = new THREE.Mesh(sGeo, sMat);
      screenMesh.position.set((sIdx - 1) * 1.2, 0.2, 1.12);
      screenMesh.rotation.x = -0.3;
      consoleStand.add(screenMesh);
    });

    consoleStand.position.set(10.5, -8.2, 10.5);
    scene.add(consoleStand);

    // --- 9. INTERACTIVE NEBULA SPARK EFFECT (Click to Burst Particles) ---
    const createSparkTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(255, 240, 180, 0.95)');
      grad.addColorStop(0.45, 'rgba(56, 189, 248, 0.7)');
      grad.addColorStop(0.75, 'rgba(168, 85, 247, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);

      // Delicate 4-point cross-flare glint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(31, 8, 2, 48);
      ctx.fillRect(8, 31, 48, 2);
      return new THREE.CanvasTexture(canvas);
    };

    const MAX_SPARKS = 800;
    const sparkPositions = new Float32Array(MAX_SPARKS * 3);
    const sparkColors = new Float32Array(MAX_SPARKS * 3);

    // Initialize off-screen
    for (let i = 0; i < MAX_SPARKS; i++) {
      sparkPositions[i * 3] = 0;
      sparkPositions[i * 3 + 1] = -9999;
      sparkPositions[i * 3 + 2] = 0;
      sparkColors[i * 3] = 0;
      sparkColors[i * 3 + 1] = 0;
      sparkColors[i * 3 + 2] = 0;
    }

    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeo.setAttribute('color', new THREE.BufferAttribute(sparkColors, 3));

    const sparkTexture = createSparkTexture();
    const sparkMat = new THREE.PointsMaterial({
      size: 4.8,
      map: sparkTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(sparkMat);

    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    // Particle state tracking pool
    interface SparkParticle {
      active: boolean;
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
      r: number;
      g: number;
      b: number;
    }

    const sparkPool: SparkParticle[] = Array.from({ length: MAX_SPARKS }, () => ({
      active: false,
      x: 0,
      y: 0,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1.5,
      r: 1,
      g: 1,
      b: 1,
    }));

    let nextSparkIndex = 0;

    // Ephemeral spark flash point light
    const sparkLight = new THREE.PointLight(0x38bdf8, 0, 20);
    scene.add(sparkLight);
    let sparkLightIntensity = 0;

    const triggerNebulaSparks = (origin: THREE.Vector3, count = 75) => {
      // Cosmic color palettes: Cyan, Amethyst, Warm Amber Gold, Copper, Core White
      const palettes = [
        { r: 0.22, g: 0.74, b: 0.97 }, // Electric Cyan (#38bdf8)
        { r: 0.75, g: 0.52, b: 0.98 }, // Amethyst Purple (#c084fc)
        { r: 0.98, g: 0.75, b: 0.14 }, // Warm Amber Gold (#fbbf24)
        { r: 0.97, g: 0.45, b: 0.12 }, // Warm Copper (#f97316)
        { r: 1.0, g: 1.0, b: 1.0 },    // Core White
      ];

      for (let i = 0; i < count; i++) {
        const p = sparkPool[nextSparkIndex];
        p.active = true;
        // Jitter origin slightly
        p.x = origin.x + (Math.random() - 0.5) * 0.3;
        p.y = origin.y + (Math.random() - 0.5) * 0.3;
        p.z = origin.z + (Math.random() - 0.5) * 0.3;

        // Spherical explosion velocities
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = 2.0 + Math.random() * 6.5;

        p.vx = Math.sin(phi) * Math.cos(theta) * speed;
        p.vy = Math.sin(phi) * Math.sin(theta) * speed + (Math.random() * 0.9);
        p.vz = Math.cos(phi) * speed;

        p.life = 0;
        p.maxLife = 1.0 + Math.random() * 0.8;

        const col = palettes[Math.floor(Math.random() * palettes.length)];
        p.r = col.r;
        p.g = col.g;
        p.b = col.b;

        nextSparkIndex = (nextSparkIndex + 1) % MAX_SPARKS;
      }

      // Flash point light at burst origin
      sparkLight.position.copy(origin);
      sparkLight.color.setHex(Math.random() > 0.5 ? 0x38bdf8 : 0xf59e0b);
      sparkLightIntensity = 6.0;

      // Celestial audio chime
      audioService.playSparkChime();
    };

    // --- Animation & Camera State ---
    const targetCamPos = new THREE.Vector3(11, 7.5, 17);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const manualRotation = { x: 0, y: 0 };
    const previousMousePosition = { x: 0, y: 0 };
    let isDragging = false;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        manualRotation.y += deltaX * 0.005;
        manualRotation.x += deltaY * 0.005;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [data-interactive="true"]')) {
        return;
      }
      isDragging = true;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = performance.now();
      previousMousePosition.x = e.clientX;
      previousMousePosition.y = e.clientY;
    };

    const onMouseUp = (e: MouseEvent) => {
      isDragging = false;
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      const dt = performance.now() - pointerDownTime;

      // If clicked with minimal movement (not a drag-orbit)
      if (dx < 7 && dy < 7 && dt < 550) {
        if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [data-interactive="true"]')) {
          return;
        }
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        const targets = [stationGroup, platformGroup, consoleStand, crystalGroup, floor];
        const intersects = raycaster.intersectObjects(targets, true);

        let burstPos: THREE.Vector3;
        if (intersects.length > 0) {
          const hit = intersects[0];
          burstPos = hit.point.clone();
          if (hit.face) {
            burstPos.add(hit.face.normal.clone().multiplyScalar(0.25));
          }
        } else {
          // Empty space click: burst in front of camera along the ray
          burstPos = camera.position.clone().add(raycaster.ray.direction.clone().multiplyScalar(13));
        }

        triggerNebulaSparks(burstPos, 70);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [data-interactive="true"]')) {
          return;
        }
        isDragging = true;
        pointerDownPos = { x: touch.clientX, y: touch.clientY };
        pointerDownTime = performance.now();
        previousMousePosition.x = touch.clientX;
        previousMousePosition.y = touch.clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;

        if (isDragging) {
          const deltaX = touch.clientX - previousMousePosition.x;
          const deltaY = touch.clientY - previousMousePosition.y;
          manualRotation.y += deltaX * 0.005;
          manualRotation.x += deltaY * 0.005;
          previousMousePosition.x = touch.clientX;
          previousMousePosition.y = touch.clientY;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      isDragging = false;
      if (e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const dx = Math.abs(touch.clientX - pointerDownPos.x);
        const dy = Math.abs(touch.clientY - pointerDownPos.y);
        const dt = performance.now() - pointerDownTime;

        if (dx < 10 && dy < 10 && dt < 550) {
          if ((e.target as HTMLElement).closest('button, a, input, select, textarea, [data-interactive="true"]')) {
            return;
          }
          pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
          pointer.y = -(touch.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);

          const targets = [stationGroup, platformGroup, consoleStand, crystalGroup, floor];
          const intersects = raycaster.intersectObjects(targets, true);

          let burstPos: THREE.Vector3;
          if (intersects.length > 0) {
            burstPos = intersects[0].point.clone();
          } else {
            burstPos = camera.position.clone().add(raycaster.ray.direction.clone().multiplyScalar(13));
          }
          triggerNebulaSparks(burstPos, 65);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    const onResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);

      // Update nebula spark particles
      const posAttr = sparkGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = sparkGeo.attributes.color as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const colArray = colAttr.array as Float32Array;
      let hasActiveSparks = false;

      for (let i = 0; i < MAX_SPARKS; i++) {
        const p = sparkPool[i];
        if (!p.active) continue;

        p.life += delta / p.maxLife;
        if (p.life >= 1.0) {
          p.active = false;
          posArray[i * 3 + 1] = -9999;
          colArray[i * 3] = 0;
          colArray[i * 3 + 1] = 0;
          colArray[i * 3 + 2] = 0;
          continue;
        }

        hasActiveSparks = true;
        // Motion physics: drag + upward nebula buoyancy
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.z += p.vz * delta;

        const drag = Math.pow(0.92, delta * 60);
        p.vx *= drag;
        p.vy *= drag;
        p.vz *= drag;
        p.vy += 0.45 * delta; // gentle cosmic rise

        // Alpha falloff
        const progress = p.life;
        const fade = Math.max(0, 1 - Math.pow(progress, 1.4));

        posArray[i * 3] = p.x;
        posArray[i * 3 + 1] = p.y;
        posArray[i * 3 + 2] = p.z;

        colArray[i * 3] = p.r * fade;
        colArray[i * 3 + 1] = p.g * fade;
        colArray[i * 3 + 2] = p.b * fade;
      }

      if (hasActiveSparks) {
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      }

      // Decay spark flash light
      if (sparkLightIntensity > 0) {
        sparkLightIntensity *= Math.pow(0.85, delta * 60);
        if (sparkLightIntensity < 0.05) sparkLightIntensity = 0;
        sparkLight.intensity = sparkLightIntensity;
      }

      // Mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      const speedFactor = rotationSpeed || 1;
      stationGroup.rotation.y += 0.0022 * speedFactor;

      // Habitat rings autonomous counter-rotations
      outerRing.rotation.z += 0.006 * speedFactor;
      innerRing.rotation.z -= 0.009 * speedFactor;

      // Tokamak reactor core pulsing
      const pulse = Math.sin(elapsedTime * 3) * 0.12 + 1.0;
      reactorCore.scale.set(pulse, pulse, pulse);
      coreLight.intensity = 4.2 + Math.sin(elapsedTime * 5) * 1.1;

      // Crystals hovering & rotating
      crystals.forEach((c, idx) => {
        c.rotation.y += 0.02 * (idx % 2 === 0 ? 1 : -1);
        c.rotation.x = Math.sin(elapsedTime * 2 + idx) * 0.2;
        c.position.y = 0.8 + Math.sin(elapsedTime * 2.5 + idx * 1.5) * 0.12;
      });

      // Earth slow rotation
      earthGroup.rotation.y = elapsedTime * 0.005;

      // Parallax tilt on station
      stationGroup.rotation.x = 0.32 + mouse.y * 0.18 + manualRotation.x;
      stationGroup.rotation.z = 0.25 - mouse.x * 0.14;
      stationGroup.rotation.y += manualRotation.y * 0.04;
      manualRotation.x *= 0.96;
      manualRotation.y *= 0.96;

      // Camera interpolation
      camera.position.lerp(targetCamPos, 0.04);
      currentLookAt.lerp(targetLookAt, 0.04);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    sceneRef.current = {
      scene,
      camera,
      renderer,
      stationGroup,
      outerRing,
      innerRing,
      reactorCore,
      coreLight,
      gallerySpots: [warmGallerySpot, coolGallerySpot, amethystGallerySpot],
      crystals,
      materials,
      targetCamPos,
      targetLookAt,
      currentLookAt,
      mouse,
      isDragging,
      previousMousePosition,
      manualRotation,
      clock,
      frameId,
    };

    if (onLoaded) {
      onLoaded();
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);

      sparkGeo.dispose();
      sparkTexture.dispose();
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  // Update Camera Target based on Preset
  useEffect(() => {
    if (!sceneRef.current) return;
    const { targetCamPos, targetLookAt } = sceneRef.current;

    switch (cameraPreset) {
      case 'gallery':
      case 'hero':
        // Museum gallery overview: elevated, close-up perspective
        targetCamPos.set(11, 7.5, 17);
        targetLookAt.set(0, 0, 0);
        break;
      case 'astra1':
      case 'habitat':
        // Close-up on the ASTRA-1 centerpiece model and plaque
        targetCamPos.set(3.8, 3.2, 7.2);
        targetLookAt.set(0, 2.5, 0);
        break;
      case 'fleet':
        // Foreground diorama of physical fleet models & pedestals
        targetCamPos.set(-2, -5.2, 13);
        targetLookAt.set(-1, -7.2, 8);
        break;
      case 'console':
        // Interactive tactile console at bottom right
        targetCamPos.set(8.5, -6.5, 13.5);
        targetLookAt.set(10.5, -8.2, 10.5);
        break;
      case 'crystals':
        // Integrated crystalline data hubs at bottom center
        targetCamPos.set(0, -6.5, 14.5);
        targetLookAt.set(0, -8.6, 11);
        break;
      case 'reactor':
        targetCamPos.set(3.2, -0.2, 5.8);
        targetLookAt.set(0, 0, 0);
        break;
      case 'solar':
        targetCamPos.set(13, 8, 8);
        targetLookAt.set(0, -3.8, 0);
        break;
      case 'drift':
        targetCamPos.set(20, 11, 24);
        targetLookAt.set(0, 0, 0);
        break;
    }
  }, [cameraPreset]);

  // Wireframe toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.materials.forEach((mat) => {
      if ('wireframe' in mat) {
        (mat as THREE.MeshStandardMaterial).wireframe = wireframe;
      }
    });
  }, [wireframe]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
}
