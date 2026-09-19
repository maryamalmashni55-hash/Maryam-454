import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../utils/audio';
import { FastForward, Volume2, VolumeX } from 'lucide-react';

interface CinematicIntroProps {
  onEnter: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onEnter }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const hasFinishedRef = useRef<boolean>(false);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    sound.playSubtleWhoosh();
    setIsFadingOut(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.018);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // --- PROCEDURAL BIOLOGICAL TISSUE TEXTURES ---
    const createFleshTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Deep organic visceral gradient
      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#5a0e1c');
      grad.addColorStop(0.5, '#731424');
      grad.addColorStop(1, '#420a14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // Capillaries & vascular fiber network
      for (let i = 0; i < 45; i++) {
        ctx.strokeStyle = `rgba(180, 24, 45, ${0.25 + Math.random() * 0.35})`;
        ctx.lineWidth = 1.0 + Math.random() * 2.0;
        ctx.beginPath();
        let x = Math.random() * 512;
        let y = Math.random() * 512;
        ctx.moveTo(x, y);
        for (let j = 0; j < 5; j++) {
          x += (Math.random() - 0.5) * 70;
          y += (Math.random() - 0.5) * 70;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Mucosal glistening cells
      for (let i = 0; i < 280; i++) {
        const px = Math.random() * 512;
        const py = Math.random() * 512;
        const pr = 1 + Math.random() * 3.5;
        ctx.fillStyle = `rgba(235, 90, 110, ${0.18 + Math.random() * 0.25})`;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 24);
      return texture;
    };

    const createFleshBumpMap = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 256, 256);

      for (let i = 0; i < 180; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = 2 + Math.random() * 6;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, '#808080');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 32);
      return texture;
    };

    const fleshTexture = createFleshTexture();
    const fleshBumpMap = createFleshBumpMap();

    // --- LIGHTING ---
    // Warm biological visceral ambient light (subsurface scattering simulation)
    const ambientLight = new THREE.AmbientLight(0x4a121e, 1.6);
    scene.add(ambientLight);

    // Medical endoscopic camera light (focused, warm-white, realistic specular reflections)
    const headLight = new THREE.PointLight(0xfff1ea, 4.0, 55);
    camera.add(headLight);

    const headSpot = new THREE.SpotLight(0xffeedd, 3.0, 45, Math.PI / 3.2, 0.4, 1.2);
    headSpot.position.set(0, 0, 0);
    headSpot.target.position.set(0, 0, -10);
    camera.add(headSpot);
    camera.add(headSpot.target);

    scene.add(camera);

    // --- CAMERA PATH (SPLINE THROUGH THE BODY) ---
    const points = [
      new THREE.Vector3(0, 0, 0),        // Start: Cellular tissue entry
      new THREE.Vector3(0, -1, -30),     // Diving into vascular channel
      new THREE.Vector3(3, 1, -70),      // Zone 1: Pulmonary tree / Bronchi
      new THREE.Vector3(-2, 2, -110),    // Deep in Alveolar clusters
      new THREE.Vector3(0, -1, -150),    // Zone 2: Heart chamber entrance
      new THREE.Vector3(2, -3, -190),    // Inside Ventricular cavity
      new THREE.Vector3(-1, 0, -230),    // Zone 3: Skeletal Ribcage & Bone
      new THREE.Vector3(0, 2, -270),     // Trabecular bone marrow vault
      new THREE.Vector3(0, 5, -310),     // Zone 4: Breakout threshold
      new THREE.Vector3(0, 8, -350),     // Outside the body
      new THREE.Vector3(0, 4, -390)      // Final holistic full body view
    ];
    const curve = new THREE.CatmullRomCurve3(points);

    // --- CONTINUOUS REALISTIC FLESHY TISSUE TUNNEL (Inside the body) ---
    // Solid organic vascular & visceral tube surrounding camera path up to breakout
    const tunnelCurve = new THREE.CatmullRomCurve3(points.slice(0, 9));
    const tunnelGeo = new THREE.TubeGeometry(tunnelCurve, 160, 4.2, 24, false);
    const tunnelMat = new THREE.MeshStandardMaterial({
      map: fleshTexture,
      bumpMap: fleshBumpMap,
      bumpScale: 0.18,
      roughness: 0.32,
      metalness: 0.05,
      side: THREE.BackSide // Camera is inside the tunnel
    });
    const fleshTunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
    scene.add(fleshTunnel);

    // --- 1. REALISTIC LUNGS & PULMONARY TREE (ZONE 1: Z ~ -40 to -120) ---
    const lungsGroup = new THREE.Group();

    // Solid cartilaginous bronchial rings (Soft ivory/pink cartilage, non-wireframe)
    const lungRingCount = 28;
    const lungRingGeo = new THREE.TorusGeometry(3.6, 0.18, 16, 32);
    const lungRingMat = new THREE.MeshStandardMaterial({
      color: 0xf3d2c9,
      roughness: 0.35,
      metalness: 0.04,
      emissive: 0x5a1824,
      emissiveIntensity: 0.2
    });
    
    for (let i = 0; i < lungRingCount; i++) {
      const ring = new THREE.Mesh(lungRingGeo, lungRingMat);
      const t = 0.12 + (i / lungRingCount) * 0.22;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      ring.position.copy(pt);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      ring.scale.set(1 + Math.sin(i * 0.5) * 0.25, 1 + Math.cos(i * 0.4) * 0.2, 1);
      lungsGroup.add(ring);
    }

    // Alveolar Sac Clusters (Grape-like bunches of glistening organic lung cells)
    const alveoliClusterCount = 24;
    const alveoliCellGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const alveoliCellMat = new THREE.MeshStandardMaterial({
      color: 0xdf6f78,
      roughness: 0.28,
      metalness: 0.08,
      emissive: 0x991b1b,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.92
    });

    const alveoliGroup = new THREE.Group();
    for (let c = 0; c < alveoliClusterCount; c++) {
      const t = 0.14 + (c / alveoliClusterCount) * 0.20;
      const pt = curve.getPointAt(t);
      const angle = c * 2.1;
      const dist = 3.2 + Math.sin(c * 1.5) * 0.6;
      const cx = pt.x + Math.cos(angle) * dist;
      const cy = pt.y + Math.sin(angle) * dist;
      const cz = pt.z;

      // Group of 5-8 miniature spherical sacs per cluster
      for (let s = 0; s < 6; s++) {
        const cell = new THREE.Mesh(alveoliCellGeo, alveoliCellMat);
        cell.position.set(
          cx + (Math.random() - 0.5) * 0.7,
          cy + (Math.random() - 0.5) * 0.7,
          cz + (Math.random() - 0.5) * 0.7
        );
        cell.scale.setScalar(0.7 + Math.random() * 0.5);
        alveoliGroup.add(cell);
      }
    }
    lungsGroup.add(alveoliGroup);

    // Microscopic oxygen droplets/globules (Soft, realistic glistening fluid particles)
    const o2Count = 800;
    const o2Geo = new THREE.BufferGeometry();
    const o2Positions = new Float32Array(o2Count * 3);
    for (let i = 0; i < o2Count; i++) {
      const t = 0.12 + Math.random() * 0.23;
      const pt = curve.getPointAt(t);
      const radius = 0.4 + Math.random() * 3.2;
      const angle = Math.random() * Math.PI * 2;
      o2Positions[i * 3] = pt.x + Math.cos(angle) * radius;
      o2Positions[i * 3 + 1] = pt.y + Math.sin(angle) * radius;
      o2Positions[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 3;
    }
    o2Geo.setAttribute('position', new THREE.BufferAttribute(o2Positions, 3));
    const o2Mat = new THREE.PointsMaterial({
      size: 0.14,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const o2Points = new THREE.Points(o2Geo, o2Mat);
    lungsGroup.add(o2Points);
    scene.add(lungsGroup);

    // --- 2. REALISTIC CARDIAC CHAMBER & BLOOD STREAM (ZONE 2: Z ~ -130 to -210) ---
    const heartGroup = new THREE.Group();

    // Solid muscular ridges / Trabeculae carneae (Organic myocardium rings, deep ruby)
    const heartRingCount = 26;
    const heartRingGeo = new THREE.TorusGeometry(3.5, 0.32, 16, 32);
    const heartRingMat = new THREE.MeshStandardMaterial({
      color: 0x70101f,
      bumpMap: fleshBumpMap,
      bumpScale: 0.25,
      roughness: 0.35,
      metalness: 0.08,
      emissive: 0x420912,
      emissiveIntensity: 0.3
    });

    const heartRings: THREE.Mesh[] = [];
    for (let i = 0; i < heartRingCount; i++) {
      const ring = new THREE.Mesh(heartRingGeo, heartRingMat);
      const t = 0.38 + (i / heartRingCount) * 0.24;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      ring.position.copy(pt);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      ring.scale.set(1.1 + Math.sin(i * 0.4) * 0.35, 0.95 + Math.cos(i * 0.4) * 0.3, 1);
      heartGroup.add(ring);
      heartRings.push(ring);
    }

    // Authentic Biconcave Red Blood Cell (RBC) Stream (Solid glistening disks tumbling in blood)
    const rbcDiskGroup = new THREE.Group();
    const rbcMeshCount = 180;
    const rbcDiskGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.08, 16);
    rbcDiskGeo.scale(1, 0.6, 1); // Flatten into real biconcave erythrocyte proportion
    const rbcDiskMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.24,
      metalness: 0.12,
      emissive: 0x5a0a14,
      emissiveIntensity: 0.2
    });

    const rbcMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < rbcMeshCount; i++) {
      const mesh = new THREE.Mesh(rbcDiskGeo, rbcDiskMat);
      const t = 0.38 + (i / rbcMeshCount) * 0.24;
      const pt = curve.getPointAt(t);
      const radius = 0.4 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      mesh.position.set(
        pt.x + Math.cos(angle) * radius,
        pt.y + Math.sin(angle) * radius,
        pt.z + (Math.random() - 0.5) * 4
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rbcDiskGroup.add(mesh);
      rbcMeshes.push(mesh);
    }
    heartGroup.add(rbcDiskGroup);

    // Anatomical Heart Center (Ventricles & Aorta Model, rich solid muscular tissue)
    const heartCenterGrp = new THREE.Group();
    const ventricleGeo = new THREE.SphereGeometry(3.8, 24, 24);
    ventricleGeo.scale(0.85, 1.25, 0.85); // Organic heart cone shape
    const ventricleMat = new THREE.MeshStandardMaterial({
      color: 0x881337,
      bumpMap: fleshBumpMap,
      bumpScale: 0.3,
      roughness: 0.32,
      metalness: 0.08,
      emissive: 0x450a14,
      emissiveIntensity: 0.35
    });
    const heartVent = new THREE.Mesh(ventricleGeo, ventricleMat);
    heartCenterGrp.add(heartVent);

    // Aorta arch vessel branching from the top of the heart
    const aortaCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 3.2, 0),
      new THREE.Vector3(0, 5.5, -1),
      new THREE.Vector3(2.5, 5.0, -2),
      new THREE.Vector3(2.8, 2.5, -3)
    );
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 20, 0.7, 16, false);
    const aortaMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.28,
      metalness: 0.08
    });
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    heartCenterGrp.add(aortaMesh);

    const heartCenterPos = curve.getPointAt(0.5);
    heartCenterGrp.position.copy(heartCenterPos);
    heartGroup.add(heartCenterGrp);
    scene.add(heartGroup);

    // --- 3. REALISTIC SKELETAL MATRIX & RIBS (ZONE 3: Z ~ -220 to -290) ---
    const boneGroup = new THREE.Group();

    // Solid 3D Ivory Rib Arches (Realistic bone curvature, cylindrical cross-section)
    const ribCount = 18;
    const ribBoneMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7, // Natural ivory bone
      roughness: 0.42,
      metalness: 0.04,
      emissive: 0x3d3627,
      emissiveIntensity: 0.15
    });

    for (let i = 0; i < ribCount; i++) {
      const ribRadiusX = 4.6 + (i % 3) * 0.35;
      const ribRadiusY = 3.6;
      const ribCurve2D = new THREE.EllipseCurve(0, 0, ribRadiusX, ribRadiusY, 0, Math.PI, false, 0);
      const ribPts = ribCurve2D.getPoints(24).map(p => new THREE.Vector3(p.x, p.y, 0));
      const ribCurve3D = new THREE.CatmullRomCurve3(ribPts);
      const ribTubeGeo = new THREE.TubeGeometry(ribCurve3D, 24, 0.22, 12, false);
      const ribMesh = new THREE.Mesh(ribTubeGeo, ribBoneMat);

      const t = 0.64 + (i / ribCount) * 0.22;
      const pt = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      ribMesh.position.copy(pt);
      ribMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      boneGroup.add(ribMesh);
    }

    // Porous Trabecular Bone Mineral Network (Solid ivory struts)
    const trabGroup = new THREE.Group();
    const trabStrutGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8);
    for (let i = 0; i < 70; i++) {
      const strut = new THREE.Mesh(trabStrutGeo, ribBoneMat);
      const t = 0.65 + Math.random() * 0.20;
      const pt = curve.getPointAt(t);
      const rad = 1.8 + Math.random() * 2.2;
      const ang = Math.random() * Math.PI * 2;
      strut.position.set(pt.x + Math.cos(ang) * rad, pt.y + Math.sin(ang) * rad, pt.z + (Math.random() - 0.5) * 3);
      strut.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      trabGroup.add(strut);
    }
    boneGroup.add(trabGroup);
    scene.add(boneGroup);

    // --- 4. REALISTIC BREAKOUT & HOLISTIC HUMAN ANATOMY (ZONE 4: OUTSIDE THE BODY) ---
    const macroGroup = new THREE.Group();
    const finalPt = curve.getPointAt(0.96);

    // Realistic Anatomical Human Silhouette (Torso, head, shoulders)
    const torsoGeo = new THREE.CylinderGeometry(1.2, 1.8, 8.5, 20);
    torsoGeo.scale(1.2, 1.0, 0.7); // Human chest proportions
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xe0a996, // Warm human skin tone
      roughness: 0.5,
      metalness: 0.05,
      transparent: true,
      opacity: 0.65
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, skinMat);
    torsoMesh.position.set(finalPt.x, finalPt.y + 1, finalPt.z - 22);
    macroGroup.add(torsoMesh);

    // Head
    const headGeo = new THREE.SphereGeometry(1.2, 20, 20);
    headGeo.scale(0.85, 1.15, 0.95);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.set(finalPt.x, finalPt.y + 6.2, finalPt.z - 22);
    macroGroup.add(headMesh);

    // Visible Internal Organs inside the translucent torso (Heart & Lungs)
    const innerHeartGeo = new THREE.SphereGeometry(0.75, 16, 16);
    const innerHeartMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      roughness: 0.3
    });
    const innerHeart = new THREE.Mesh(innerHeartGeo, innerHeartMat);
    innerHeart.position.set(finalPt.x - 0.4, finalPt.y + 1.6, finalPt.z - 22);
    macroGroup.add(innerHeart);

    const innerLungGeo = new THREE.SphereGeometry(0.9, 16, 16);
    innerLungGeo.scale(0.8, 1.3, 0.7);
    const innerLungMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.8
    });
    const leftLung = new THREE.Mesh(innerLungGeo, innerLungMat);
    leftLung.position.set(finalPt.x - 1.1, finalPt.y + 1.8, finalPt.z - 22);
    macroGroup.add(leftLung);

    const rightLung = new THREE.Mesh(innerLungGeo, innerLungMat);
    rightLung.position.set(finalPt.x + 1.1, finalPt.y + 1.8, finalPt.z - 22);
    macroGroup.add(rightLung);

    // Soft warm environmental lighting around the emerged human body
    const haloLight = new THREE.PointLight(0x38bdf8, 2.5, 35);
    haloLight.position.set(finalPt.x, finalPt.y + 2, finalPt.z - 18);
    macroGroup.add(haloLight);

    scene.add(macroGroup);

    // --- MOUSE PARALLAX CONTROLS ---
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION TIMELINE ENGINE ---
    let progress = 0;
    let clock = new THREE.Clock();
    let animId: number;
    let lastAudioTriggerStage = -1;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Clamp delta to prevent big frame skips or stutter
      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.04);
      const elapsed = clock.getElapsedTime();

      // Camera flight progress (0.0 to 1.0 in ~10 seconds for silky, snappy responsiveness)
      progress += delta * 0.105;
      if (progress > 1.0) progress = 1.0;

      // Update current camera position & look-ahead point
      const camPos = curve.getPointAt(progress);
      const lookAheadProgress = Math.min(progress + 0.025, 1.0);
      const lookAtPos = curve.getPointAt(lookAheadProgress);

      // Mouse subtle offset for dynamic control
      camera.position.x = camPos.x + mouseX * 0.8;
      camera.position.y = camPos.y + mouseY * 0.6;
      camera.position.z = camPos.z;
      camera.lookAt(lookAtPos.x + mouseX * 1.5, lookAtPos.y + mouseY * 1.2, lookAtPos.z);

      // Medical light adjusts naturally to organ illumination
      if (progress < 0.35) {
        // Pulmonary: Soft warm natural tone with slight oxygen cyan fill
        headLight.color.setHex(0xfef2f2);
        if (scene.fog) scene.fog.color.setHex(0x1a080e);
      } else if (progress < 0.62) {
        // Cardiac: Deep warm visceral arterial glow
        headLight.color.setHex(0xffe4e6);
        if (scene.fog) scene.fog.color.setHex(0x24060c);
      } else if (progress < 0.85) {
        // Skeletal / Bone: Warm natural ivory ambient
        headLight.color.setHex(0xfef9c3);
        if (scene.fog) scene.fog.color.setHex(0x1a150b);
      } else {
        // Breakout: Clean daylight clarity
        headLight.color.setHex(0xffffff);
        if (scene.fog) scene.fog.color.setHex(0x030712);
      }

      // Hide internal tunnel when emerging into open air
      fleshTunnel.visible = progress < 0.90;

      // Realistic cardiac rhythmic contraction (systole & diastole)
      const heartPulse = 1.0 + Math.pow(Math.sin(elapsed * 4.2), 6) * 0.22;
      heartVent.scale.set(0.85 * heartPulse, 1.25 * heartPulse, 0.85 * heartPulse);
      innerHeart.scale.setScalar(heartPulse * 0.9);

      // Pulse myocardial wall rings
      heartRings.forEach((r, idx) => {
        r.scale.set(
          1.1 + Math.sin(elapsed * 4.2 + idx * 0.25) * 0.12,
          0.95 + Math.cos(elapsed * 4.2 + idx * 0.25) * 0.12,
          1.0
        );
      });

      // Realistic RBC tumbling flow
      rbcMeshes.forEach((m) => {
        m.rotation.x += 0.02;
        m.rotation.y += 0.03;
      });

      // Alveoli respiratory breathing motion
      alveoliGroup.children.forEach((cell, idx) => {
        const breath = 1.0 + Math.sin(elapsed * 1.8 + idx * 0.3) * 0.08;
        cell.scale.setScalar(breath);
      });

      // Oxygen particles gentle drift
      o2Points.rotation.z += 0.002;
      trabGroup.rotation.z = Math.sin(elapsed * 0.2) * 0.05;
      macroGroup.rotation.y = elapsed * 0.12;

      // STAGE DISPATCHER FOR AUDIO TRANSITIONS
      let activeStageIdx = 0;
      if (progress < 0.12) {
        activeStageIdx = 0;
      } else if (progress < 0.37) {
        activeStageIdx = 1;
      } else if (progress < 0.63) {
        activeStageIdx = 2;
      } else if (progress < 0.86) {
        activeStageIdx = 3;
      } else {
        activeStageIdx = 4;
      }

      // AUDIO TRIGGER PER STAGE TRANSITION
      if (activeStageIdx !== lastAudioTriggerStage) {
        lastAudioTriggerStage = activeStageIdx;
        sound.initContext?.();

        if (activeStageIdx === 0) {
          sound.playTissueDiveSound();
        } else if (activeStageIdx === 1) {
          sound.playLungBronchialBreeze();
        } else if (activeStageIdx === 2) {
          sound.playCardiacChamberThump();
        } else if (activeStageIdx === 3) {
          sound.playBoneMatrixResonance();
        } else if (activeStageIdx === 4) {
          sound.playBreakoutExplosion();
        }
      }

      // Automatically finish intro once progress reaches end
      if (progress >= 0.99 && !hasFinishedRef.current) {
        handleFinish();
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black overflow-hidden transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 bg-[#02040a] cursor-crosshair" />

      {/* Subtle Radial Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,6,23,0.85)_100%)] z-10" />

      {/* Top Floating Controls (Pure Icons, Zero Text) */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          id="skip-flight-btn"
          onClick={handleFinish}
          className="p-2.5 rounded-full bg-slate-950/50 hover:bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer backdrop-blur-md shadow-lg group"
          aria-label="Skip"
        >
          <FastForward className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Bottom Center Direct Access Pill */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={handleFinish}
          className="px-5 py-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:scale-105"
        >
          <span>تخطي المشهد والدخول المباشر</span>
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* White Flash Breakout Transition */}
      <div 
        className={`fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-700 ${
          isFadingOut ? 'opacity-100' : 'opacity-0'
        }`} 
      />
    </div>
  );
};
