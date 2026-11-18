import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Hero3DCanvasProps {
  onWebGLError?: () => void;
}

function createBracketShape(direction: 'left' | 'right'): THREE.Shape {
  const s = new THREE.Shape();
  const sign = direction === 'left' ? 1 : -1;
  // Crisp geometric developer chevron with real thickness
  s.moveTo(sign * 0.2, 0.34);
  s.lineTo(sign * 0.32, 0.24);
  s.lineTo(sign * 0.04, 0);
  s.lineTo(sign * 0.32, -0.24);
  s.lineTo(sign * 0.2, -0.34);
  s.lineTo(sign * -0.18, -0.05);
  s.lineTo(sign * -0.18, 0.05);
  s.closePath();
  return s;
}

function createPedestalGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 18, 256, 256, 240);
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.42)');
    grad.addColorStop(0.32, 'rgba(66, 133, 244, 0.26)');
    grad.addColorStop(0.68, 'rgba(66, 133, 244, 0.06)');
    grad.addColorStop(1, 'rgba(8, 11, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({ onWebGLError }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      onWebGLError?.();
      return;
    }

    const dprCap = isMobile ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(container.clientWidth || 440, container.clientHeight || 440);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      onWebGLError?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

    // Scene & Studio Environment Reflections
    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Camera with calibrated 3/4 studio framing (full pedestal + all orbiting 3D objects visible)
    const camera = new THREE.PerspectiveCamera(
      36,
      (container.clientWidth || 500) / (container.clientHeight || 500),
      0.1,
      60
    );
    const baseCamPos = new THREE.Vector3(0, 1.55, 9.45);
    camera.position.copy(baseCamPos);
    camera.lookAt(0, -0.18, 0);

    // =========================================================================
    // STUDIO LIGHTING RIG (Blue/Cyan Rim + Controlled Orange & Lime Kickers)
    // =========================================================================
    const hemiLight = new THREE.HemisphereLight(0x7db3ff, 0x080b14, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xf0f6ff, 1.85);
    keyLight.position.set(3.6, 5.8, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = isMobile ? 512 : 1024;
    keyLight.shadow.mapSize.height = isMobile ? 512 : 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const blueRim = new THREE.PointLight(0x4285f4, 14, 16, 1.5);
    blueRim.position.set(-4.0, 2.4, 2.4);
    scene.add(blueRim);

    const cyanRim = new THREE.PointLight(0x00d4ff, 12, 16, 1.5);
    cyanRim.position.set(4.1, 1.9, 2.7);
    scene.add(cyanRim);

    const orangeKicker = new THREE.PointLight(0xff7043, 6.5, 11, 1.6);
    orangeKicker.position.set(-3.3, -1.2, 2.0);
    scene.add(orangeKicker);

    const limeKicker = new THREE.PointLight(0xa8ff60, 5.2, 11, 1.6);
    limeKicker.position.set(3.2, -1.5, 1.9);
    scene.add(limeKicker);

    const backRim = new THREE.DirectionalLight(0x00d4ff, 1.35);
    backRim.position.set(-1.5, 2.5, -5.0);
    scene.add(backRim);

    // Track disposable resources
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const regGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const regMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // Shared PBR Materials
    const darkTitaniumMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x1c2840,
        metalness: 0.92,
        roughness: 0.2,
        clearcoat: 0.55,
        clearcoatRoughness: 0.16,
      })
    );

    const brushedChromeMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xd4e4ff,
        metalness: 0.96,
        roughness: 0.14,
        clearcoat: 0.7,
        clearcoatRoughness: 0.1,
      })
    );

    const gunmetalMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x131c2e,
        metalness: 0.88,
        roughness: 0.28,
      })
    );

    const cyanEmissiveMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 1.7,
        roughness: 0.15,
        metalness: 0.3,
      })
    );

    const blueEmissiveMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0x4285f4,
        emissive: 0x4285f4,
        emissiveIntensity: 1.6,
        roughness: 0.18,
        metalness: 0.35,
      })
    );

    const orangeMetallicMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xff7043,
        emissive: 0xff5722,
        emissiveIntensity: 0.35,
        metalness: 0.78,
        roughness: 0.22,
        clearcoat: 0.65,
      })
    );

    const limeMetallicMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xa8ff60,
        emissive: 0x76e030,
        emissiveIntensity: 0.35,
        metalness: 0.72,
        roughness: 0.24,
        clearcoat: 0.6,
      })
    );

    const blueMetallicMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x4285f4,
        emissive: 0x1e56c5,
        emissiveIntensity: 0.28,
        metalness: 0.84,
        roughness: 0.18,
        clearcoat: 0.7,
      })
    );

    const glassBlockMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xbceeff,
        metalness: 0.05,
        roughness: 0.06,
        transmission: 0.82,
        ior: 1.48,
        thickness: 0.85,
        transparent: true,
        opacity: 1,
        attenuationColor: new THREE.Color(0x00a8e8),
        attenuationDistance: 1.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
      })
    );

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // =========================================================================
    // 1. FLOATING 3D GDG EMBLEM (Thick Extruded Metallic Frame + Official Logo)
    // =========================================================================
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 0.25, 0);
    // Slight architectural angle at rest so 3D thickness & specular edge are unmistakable
    emblemGroup.rotation.set(0.05, -0.18, 0);
    rootGroup.add(emblemGroup);

    // Thick extruded circular metallic outer frame with chamfered bevels
    const outerFrameShape = new THREE.Shape();
    outerFrameShape.absarc(0, 0, 1.44, 0, Math.PI * 2, false);
    const innerHole = new THREE.Path();
    innerHole.absarc(0, 0, 1.24, 0, Math.PI * 2, true);
    outerFrameShape.holes.push(innerHole);

    const frameGeo = regGeo(
      new THREE.ExtrudeGeometry(outerFrameShape, {
        depth: 0.26,
        bevelEnabled: true,
        bevelThickness: 0.055,
        bevelSize: 0.048,
        bevelSegments: 4,
        curveSegments: 72,
      })
    );
    frameGeo.center();
    const outerFrameMesh = new THREE.Mesh(frameGeo, darkTitaniumMat);
    outerFrameMesh.castShadow = true;
    outerFrameMesh.receiveShadow = true;
    emblemGroup.add(outerFrameMesh);

    // Solid machined titanium core cylinder behind the logo disc (prevents hollow gaps)
    const coreCylGeo = regGeo(new THREE.CylinderGeometry(1.27, 1.27, 0.24, 72));
    coreCylGeo.rotateX(Math.PI / 2);
    const coreCylMesh = new THREE.Mesh(coreCylGeo, gunmetalMat);
    coreCylMesh.castShadow = true;
    coreCylMesh.receiveShadow = true;
    emblemGroup.add(coreCylMesh);

    // Polished chrome beveled inner collar ring (front & back)
    const innerBezelGeo = regGeo(new THREE.TorusGeometry(1.26, 0.042, 20, 96));
    const frontBezel = new THREE.Mesh(innerBezelGeo, brushedChromeMat);
    frontBezel.position.z = 0.13;
    emblemGroup.add(frontBezel);

    const backBezel = new THREE.Mesh(innerBezelGeo, brushedChromeMat);
    backBezel.position.z = -0.13;
    emblemGroup.add(backBezel);

    // Thin precision cyan LED rim channel embedded in the outer metallic wall
    const rimGlowGeo = regGeo(new THREE.TorusGeometry(1.485, 0.02, 16, 96));
    const rimGlowMesh = new THREE.Mesh(rimGlowGeo, cyanEmissiveMat);
    emblemGroup.add(rimGlowMesh);

    // 4 Machined Metallic Structural Lugs with GDG Color Indicator Micro-Nodes
    const lugGeo = regGeo(new RoundedBoxGeometry(0.18, 0.25, 0.34, 3, 0.03));
    const dotGeo = regGeo(new THREE.SphereGeometry(0.036, 16, 16));
    const lugDotMats = [blueEmissiveMat, orangeMetallicMat, cyanEmissiveMat, limeMetallicMat];

    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 4) + i * (Math.PI / 2);
      const lug = new THREE.Mesh(lugGeo, brushedChromeMat);
      lug.position.set(Math.cos(angle) * 1.44, Math.sin(angle) * 1.44, 0);
      lug.rotation.z = angle - Math.PI / 2;
      lug.castShadow = true;
      emblemGroup.add(lug);

      const dot = new THREE.Mesh(dotGeo, lugDotMats[i]);
      dot.position.set(Math.cos(angle) * 1.47, Math.sin(angle) * 1.47, 0.17);
      emblemGroup.add(dot);
    }

    // Official GDG Logo Texture mapped cleanly onto front & back recessed circular discs
    const textureLoader = new THREE.TextureLoader();
    const logoTex = textureLoader.load('/assets/gdg-logo.jpeg', () => {
      // Force crisp re-render on texture load even under reduced motion
      renderer.render(scene, camera);
    });
    logoTex.colorSpace = THREE.SRGBColorSpace;
    logoTex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
    textures.push(logoTex);

    const logoDiscMat = regMat(
      new THREE.MeshStandardMaterial({
        map: logoTex,
        roughness: 0.52,
        metalness: 0.0,
        envMapIntensity: 0.22,
      })
    );

    const logoDiscGeo = regGeo(new THREE.CircleGeometry(1.23, 96));
    const frontLogoMesh = new THREE.Mesh(logoDiscGeo, logoDiscMat);
    frontLogoMesh.position.z = 0.132;
    emblemGroup.add(frontLogoMesh);

    const backLogoMesh = new THREE.Mesh(logoDiscGeo, logoDiscMat);
    backLogoMesh.position.z = -0.132;
    backLogoMesh.rotation.y = Math.PI;
    emblemGroup.add(backLogoMesh);

    // Subtle Sapphire Crystal Specular Sheen Cover (does not wash out logo)
    const glassCoverMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.09,
        roughness: 0.03,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        depthWrite: false,
      })
    );
    const glassCoverGeo = regGeo(new THREE.CircleGeometry(1.23, 64));
    const glassCover = new THREE.Mesh(glassCoverGeo, glassCoverMat);
    glassCover.position.z = 0.165;
    emblemGroup.add(glassCover);

    // =========================================================================
    // 2. CIRCULAR FUTURISTIC FLOATING PEDESTAL & REFLECTIVE SHADOW DECK
    // =========================================================================
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.92, 0);
    rootGroup.add(pedestalGroup);

    // Lower heavy beveled titanium platform
    const baseCylGeo = regGeo(new THREE.CylinderGeometry(1.98, 2.26, 0.24, 72));
    const baseCyl = new THREE.Mesh(baseCylGeo, darkTitaniumMat);
    baseCyl.receiveShadow = true;
    pedestalGroup.add(baseCyl);

    // Middle machined metallic step
    const midCylGeo = regGeo(new THREE.CylinderGeometry(1.64, 1.84, 0.13, 72));
    const midCyl = new THREE.Mesh(midCylGeo, gunmetalMat);
    midCyl.position.y = 0.175;
    midCyl.receiveShadow = true;
    pedestalGroup.add(midCyl);

    // Top dark reflective polished glass deck
    const deckMat = regMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0b1222,
        metalness: 0.72,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
      })
    );
    const deckGeo = regGeo(new THREE.CylinderGeometry(1.56, 1.56, 0.04, 72));
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.y = 0.255;
    deckMesh.receiveShadow = true;
    pedestalGroup.add(deckMesh);

    // Real soft cast shadow catcher right over the reflective deck
    const shadowCatcherMat = regMat(
      new THREE.ShadowMaterial({
        opacity: 0.52,
      })
    );
    const shadowCatcherGeo = regGeo(new THREE.CircleGeometry(1.54, 64));
    shadowCatcherGeo.rotateX(-Math.PI / 2);
    const shadowCatcher = new THREE.Mesh(shadowCatcherGeo, shadowCatcherMat);
    shadowCatcher.position.y = 0.278;
    shadowCatcher.receiveShadow = true;
    pedestalGroup.add(shadowCatcher);

    // Subtle reflective radial light pool on the pedestal surface
    const glowTex = createPedestalGlowTexture();
    textures.push(glowTex);
    const floorGlowMat = regMat(
      new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const floorGlowGeo = regGeo(new THREE.CircleGeometry(1.52, 64));
    floorGlowGeo.rotateX(-Math.PI / 2);
    const floorGlow = new THREE.Mesh(floorGlowGeo, floorGlowMat);
    floorGlow.position.y = 0.281;
    pedestalGroup.add(floorGlow);

    // Embedded Glowing Pedestal Rim Channels
    const outerPedRingGeo = regGeo(new THREE.TorusGeometry(1.98, 0.026, 16, 96));
    outerPedRingGeo.rotateX(Math.PI / 2);
    const outerPedRing = new THREE.Mesh(outerPedRingGeo, blueEmissiveMat);
    outerPedRing.position.y = 0.11;
    pedestalGroup.add(outerPedRing);

    const innerPedRingGeo = regGeo(new THREE.TorusGeometry(1.6, 0.018, 16, 96));
    innerPedRingGeo.rotateX(Math.PI / 2);
    const innerPedRing = new THREE.Mesh(innerPedRingGeo, cyanEmissiveMat);
    innerPedRing.position.y = 0.25;
    pedestalGroup.add(innerPedRing);

    // Lower floating hover-thruster ring underneath the pedestal
    const underRingGeo = regGeo(new THREE.TorusGeometry(1.18, 0.028, 14, 72));
    underRingGeo.rotateX(Math.PI / 2);
    const underRing = new THREE.Mesh(underRingGeo, blueEmissiveMat);
    underRing.position.y = -0.14;
    pedestalGroup.add(underRing);

    // =========================================================================
    // 3. LAYERED 3D ROTATING ORBITAL RINGS (Extruded Metallic + Energy Arcs)
    // =========================================================================
    const ring1Group = new THREE.Group();
    ring1Group.position.set(0, 0.22, 0);
    ring1Group.rotation.set(0.46, 0.22, -0.34);
    rootGroup.add(ring1Group);

    const r1BaseGeo = regGeo(new THREE.TorusGeometry(2.12, 0.036, 18, 110));
    const r1Base = new THREE.Mesh(r1BaseGeo, darkTitaniumMat);
    r1Base.castShadow = true;
    ring1Group.add(r1Base);

    const r1ArcGeo = regGeo(new THREE.TorusGeometry(2.12, 0.048, 14, 48, Math.PI * 0.36));
    const r1ArcA = new THREE.Mesh(r1ArcGeo, cyanEmissiveMat);
    ring1Group.add(r1ArcA);
    const r1ArcB = new THREE.Mesh(r1ArcGeo, blueEmissiveMat);
    r1ArcB.rotation.z = Math.PI;
    ring1Group.add(r1ArcB);

    // Ring 2: Counter-rotating chrome gyro ring with 3 metallic satellite nodes
    const ring2Group = new THREE.Group();
    ring2Group.position.set(0, 0.22, 0);
    ring2Group.rotation.set(-0.58, 0.26, 0.44);
    rootGroup.add(ring2Group);

    const r2BaseGeo = regGeo(new THREE.TorusGeometry(1.86, 0.024, 16, 100));
    const r2Base = new THREE.Mesh(r2BaseGeo, brushedChromeMat);
    ring2Group.add(r2Base);

    const orbitNodeGeo = regGeo(new THREE.SphereGeometry(0.085, 20, 20));
    const orbitNodeSpecs = [
      { angle: 0.4, mat: blueMetallicMat },
      { angle: 2.5, mat: orangeMetallicMat },
      { angle: 4.6, mat: limeMetallicMat },
    ];
    orbitNodeSpecs.forEach(({ angle, mat }) => {
      const node = new THREE.Mesh(orbitNodeGeo, mat);
      node.position.set(Math.cos(angle) * 1.86, Math.sin(angle) * 1.86, 0);
      node.castShadow = true;
      ring2Group.add(node);
    });

    // Ring 3: Wide sleek horizontal halo ring hovering above pedestal
    const ring3Group = new THREE.Group();
    ring3Group.position.set(0, -1.28, 0);
    ring3Group.rotation.set(1.42, -0.08, 0.12);
    rootGroup.add(ring3Group);

    const r3BaseGeo = regGeo(new THREE.TorusGeometry(2.38, 0.018, 14, 110));
    const r3Base = new THREE.Mesh(r3BaseGeo, brushedChromeMat);
    ring3Group.add(r3Base);

    const r3ArcGeo = regGeo(new THREE.TorusGeometry(2.38, 0.026, 12, 42, Math.PI * 0.28));
    const r3Arc = new THREE.Mesh(r3ArcGeo, cyanEmissiveMat);
    ring3Group.add(r3Arc);

    // =========================================================================
    // 4. FLOATING 3D TECHNOLOGY OBJECTS (Real Extruded Depth & Materials)
    // =========================================================================
    interface FloatSpec {
      obj: THREE.Object3D;
      basePos: THREE.Vector3;
      baseRot: THREE.Euler;
      amp: number;
      speed: number;
      phase: number;
      spinX: number;
      spinY: number;
      interactive?: boolean;
    }

    const floaters: FloatSpec[] = [];
    const interactiveTargets: THREE.Object3D[] = [outerFrameMesh, frontLogoMesh];

    // 4A. Metallic Beveled Cube (Upper-Left Foreground)
    const metalCubeGroup = new THREE.Group();
    const metalCubeGeo = regGeo(new RoundedBoxGeometry(0.52, 0.52, 0.52, 4, 0.075));
    const metalCube = new THREE.Mesh(metalCubeGeo, darkTitaniumMat);
    metalCube.castShadow = true;
    metalCubeGroup.add(metalCube);

    const cubeWireGeo = regGeo(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.54, 0.54, 0.54)));
    const cubeWireMat = regMat(new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.65 }));
    metalCubeGroup.add(new THREE.LineSegments(cubeWireGeo, cubeWireMat));
    rootGroup.add(metalCubeGroup);
    interactiveTargets.push(metalCube);
    floaters.push({
      obj: metalCubeGroup,
      basePos: new THREE.Vector3(-2.12, 1.32, 0.55),
      baseRot: new THREE.Euler(0.45, 0.62, 0.2),
      amp: 0.14,
      speed: 0.9,
      phase: 0.3,
      spinX: 0.18,
      spinY: 0.26,
      interactive: true,
    });

    // 4B. Transmissive Glass Technology Block with Glowing Core (Lower-Right Foreground)
    const glassBlockGroup = new THREE.Group();
    const glassGeo = regGeo(new RoundedBoxGeometry(0.58, 0.58, 0.44, 4, 0.07));
    const glassMesh = new THREE.Mesh(glassGeo, glassBlockMat);
    glassMesh.castShadow = true;
    glassBlockGroup.add(glassMesh);

    const innerCoreGeo = regGeo(new RoundedBoxGeometry(0.22, 0.22, 0.22, 2, 0.04));
    const innerCore = new THREE.Mesh(innerCoreGeo, blueEmissiveMat);
    glassBlockGroup.add(innerCore);
    rootGroup.add(glassBlockGroup);
    interactiveTargets.push(glassMesh);
    floaters.push({
      obj: glassBlockGroup,
      basePos: new THREE.Vector3(2.08, -0.78, 0.68),
      baseRot: new THREE.Euler(0.35, -0.52, 0.18),
      amp: 0.13,
      speed: 1.05,
      phase: 1.8,
      spinX: -0.14,
      spinY: 0.22,
      interactive: true,
    });

    // 4C. Futuristic 3D Silicon Microchip Module (Upper-Right Midground)
    const chipGroup = new THREE.Group();
    const pcbGeo = regGeo(new RoundedBoxGeometry(0.68, 0.68, 0.09, 3, 0.02));
    const pcbMesh = new THREE.Mesh(pcbGeo, darkTitaniumMat);
    pcbMesh.castShadow = true;
    chipGroup.add(pcbMesh);

    const dieGeo = regGeo(new RoundedBoxGeometry(0.36, 0.36, 0.07, 3, 0.02));
    const dieMesh = new THREE.Mesh(dieGeo, brushedChromeMat);
    dieMesh.position.z = 0.055;
    chipGroup.add(dieMesh);

    const dieTraceGeo = regGeo(new THREE.BoxGeometry(0.14, 0.04, 0.02));
    const dieTrace = new THREE.Mesh(dieTraceGeo, limeMetallicMat);
    dieTrace.position.set(0.07, 0.08, 0.092);
    chipGroup.add(dieTrace);

    const pinGeo = regGeo(new THREE.BoxGeometry(0.032, 0.11, 0.032));
    const goldPinMat = regMat(
      new THREE.MeshStandardMaterial({
        color: 0xffb74d,
        metalness: 0.94,
        roughness: 0.18,
      })
    );
    const pinOffsets = [-0.21, -0.07, 0.07, 0.21];
    pinOffsets.forEach((offset) => {
      // Top & bottom pins
      const pTop = new THREE.Mesh(pinGeo, goldPinMat);
      pTop.position.set(offset, 0.37, 0);
      chipGroup.add(pTop);
      const pBot = new THREE.Mesh(pinGeo, goldPinMat);
      pBot.position.set(offset, -0.37, 0);
      chipGroup.add(pBot);
      // Left & right pins
      const pLeft = new THREE.Mesh(pinGeo, goldPinMat);
      pLeft.rotation.z = Math.PI / 2;
      pLeft.position.set(-0.37, offset, 0);
      chipGroup.add(pLeft);
      const pRight = new THREE.Mesh(pinGeo, goldPinMat);
      pRight.rotation.z = Math.PI / 2;
      pRight.position.set(0.37, offset, 0);
      chipGroup.add(pRight);
    });
    rootGroup.add(chipGroup);
    interactiveTargets.push(pcbMesh);
    floaters.push({
      obj: chipGroup,
      basePos: new THREE.Vector3(2.05, 1.28, -0.15),
      baseRot: new THREE.Euler(-0.32, -0.48, 0.22),
      amp: 0.12,
      speed: 0.85,
      phase: 2.7,
      spinX: 0.1,
      spinY: -0.2,
      interactive: true,
    });

    // 4D. Extruded 3D Developer Code Brackets `<` and `>`
    const leftBracketGeo = regGeo(
      new THREE.ExtrudeGeometry(createBracketShape('left'), {
        depth: 0.13,
        bevelEnabled: true,
        bevelThickness: 0.028,
        bevelSize: 0.022,
        bevelSegments: 3,
      })
    );
    leftBracketGeo.center();
    const leftBracket = new THREE.Mesh(leftBracketGeo, blueMetallicMat);
    leftBracket.castShadow = true;
    rootGroup.add(leftBracket);
    interactiveTargets.push(leftBracket);
    floaters.push({
      obj: leftBracket,
      basePos: new THREE.Vector3(-2.18, -0.58, 0.35),
      baseRot: new THREE.Euler(0.14, 0.38, -0.12),
      amp: 0.11,
      speed: 1.1,
      phase: 4.1,
      spinX: 0.08,
      spinY: 0.22,
      interactive: true,
    });

    const rightBracketGeo = regGeo(
      new THREE.ExtrudeGeometry(createBracketShape('right'), {
        depth: 0.13,
        bevelEnabled: true,
        bevelThickness: 0.028,
        bevelSize: 0.022,
        bevelSegments: 3,
      })
    );
    rightBracketGeo.center();
    const rightBracket = new THREE.Mesh(rightBracketGeo, orangeMetallicMat);
    rightBracket.castShadow = true;
    rootGroup.add(rightBracket);
    interactiveTargets.push(rightBracket);
    floaters.push({
      obj: rightBracket,
      basePos: new THREE.Vector3(1.88, 0.24, 0.78),
      baseRot: new THREE.Euler(-0.12, -0.42, 0.1),
      amp: 0.1,
      speed: 1.0,
      phase: 0.9,
      spinX: -0.08,
      spinY: -0.2,
      interactive: true,
    });

    // 4E. Extruded Faceted Tech Prism (Desktop Depth Accent)
    if (!isMobile) {
      const prismGroup = new THREE.Group();
      const octGeo = regGeo(new THREE.OctahedronGeometry(0.28, 0));
      const octMesh = new THREE.Mesh(octGeo, brushedChromeMat);
      octMesh.castShadow = true;
      prismGroup.add(octMesh);

      const octEdgeGeo = regGeo(new THREE.EdgesGeometry(octGeo));
      const octEdgeMat = regMat(new THREE.LineBasicMaterial({ color: 0xff7043, transparent: true, opacity: 0.8 }));
      prismGroup.add(new THREE.LineSegments(octEdgeGeo, octEdgeMat));
      rootGroup.add(prismGroup);
      floaters.push({
        obj: prismGroup,
        basePos: new THREE.Vector3(-0.98, 1.92, -0.78),
        baseRot: new THREE.Euler(0.3, 0.5, 0.2),
        amp: 0.13,
        speed: 0.95,
        phase: 5.0,
        spinX: 0.24,
        spinY: 0.3,
      });

      // Small glass accent cube lower-left back
      const miniGlassGeo = regGeo(new RoundedBoxGeometry(0.34, 0.34, 0.34, 3, 0.05));
      const miniGlass = new THREE.Mesh(miniGlassGeo, glassBlockMat);
      rootGroup.add(miniGlass);
      floaters.push({
        obj: miniGlass,
        basePos: new THREE.Vector3(-1.45, -1.32, -0.58),
        baseRot: new THREE.Euler(0.6, 0.4, 0.3),
        amp: 0.09,
        speed: 1.15,
        phase: 3.2,
        spinX: 0.16,
        spinY: -0.24,
      });
    }

    // Apply initial transforms so first static frame looks complete immediately
    floaters.forEach((f) => {
      f.obj.position.copy(f.basePos);
      f.obj.rotation.copy(f.baseRot);
    });

    // =========================================================================
    // 5. INTERACTIVE POINTER PARALLAX + RAYCAST HOVER DEPTH RESPONSE
    // =========================================================================
    const pointer = new THREE.Vector2(0, 0);
    const targetPointer = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let isHoveringEmblem = false;
    let emblemHoverScale = 1;
    let isVisible = true;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetPointer.set(
        THREE.MathUtils.clamp(nx, -1, 1),
        THREE.MathUtils.clamp(ny, -1, 1)
      );

      if (!isMobile) {
        raycaster.setFromCamera(targetPointer, camera);
        const hits = raycaster.intersectObjects(interactiveTargets, false);
        isHoveringEmblem = hits.length > 0;
        container.style.cursor = isHoveringEmblem ? 'pointer' : 'default';
      }
    };

    const handlePointerLeave = () => {
      targetPointer.set(0, 0);
      isHoveringEmblem = false;
      container.style.cursor = 'default';
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Pause WebGL loop when scrolled out of viewport to save GPU/battery
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(entry.contentRect.width, 200);
      const h = Math.max(entry.contentRect.height, 200);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    });
    resizeObserver.observe(container);

    // =========================================================================
    // 6. ANIMATION LOOP (Smooth, Controlled, Studio-Grade)
    // =========================================================================
    const clock = new THREE.Clock();
    let rafId = 0;

    const renderFrame = () => {
      rafId = requestAnimationFrame(renderFrame);
      if (!isVisible) return;

      const t = clock.getElapsedTime();

      // Smooth damped pointer interpolation
      pointer.lerp(targetPointer, 0.055);

      // Subtle controlled camera orbit response to mouse movement
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, baseCamPos.x + pointer.x * 0.78, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, baseCamPos.y + pointer.y * 0.48, 0.06);
      camera.lookAt(0, -0.18, 0);

      // Floating 3D GDG Emblem natural hover + subtle interactive tilt
      emblemGroup.position.y = 0.25 + Math.sin(t * 1.15) * 0.11;
      emblemGroup.rotation.y = THREE.MathUtils.lerp(
        emblemGroup.rotation.y,
        -0.16 + Math.sin(t * 0.55) * 0.12 + pointer.x * 0.24,
        0.07
      );
      emblemGroup.rotation.x = THREE.MathUtils.lerp(
        emblemGroup.rotation.x,
        0.05 - pointer.y * 0.16,
        0.07
      );

      // Subtle depth scale & rim pulse when hovering interactive 3D elements
      const targetScale = isHoveringEmblem ? 1.045 : 1.0;
      emblemHoverScale = THREE.MathUtils.lerp(emblemHoverScale, targetScale, 0.08);
      emblemGroup.scale.setScalar(emblemHoverScale);
      cyanEmissiveMat.emissiveIntensity = THREE.MathUtils.lerp(
        cyanEmissiveMat.emissiveIntensity,
        isHoveringEmblem ? 2.3 : 1.7,
        0.08
      );

      // Pedestal subtle breathing hover
      pedestalGroup.position.y = -1.92 + Math.sin(t * 0.9 + 1.2) * 0.04;

      // Multi-speed layered ring rotations
      ring1Group.rotation.z = -0.34 + t * 0.24;
      ring2Group.rotation.z = 0.44 - t * 0.34;
      ring3Group.rotation.z = 0.12 + t * 0.18;

      // Natural staggered motion for floating 3D technology objects
      for (let i = 0; i < floaters.length; i++) {
        const f = floaters[i];
        f.obj.position.y = f.basePos.y + Math.sin(t * f.speed + f.phase) * f.amp;
        f.obj.rotation.x = f.baseRot.x + Math.sin(t * 0.6 + f.phase) * 0.18 + t * f.spinX * 0.35;
        f.obj.rotation.y = f.baseRot.y + t * f.spinY * 0.45;
      }

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      renderFrame();
    }

    // Complete GPU Resource Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((tex) => tex.dispose());
      envRT.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onWebGLError]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full select-none touch-pan-y"
      aria-label="Interactive 3D GDG on Campus RIT Hassan Emblem Showcase"
    />
  );
};

export default Hero3DCanvas;
