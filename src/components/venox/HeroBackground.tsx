"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const LIME = new THREE.Color("#9dff3f");
const LIME_DEEP = new THREE.Color("#3f7a15");
const CORE_WHITE = new THREE.Color("#e6ffb8");

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

type StreamDatum = {
  bx: number;
  bz: number;
  height: number;
  phase: number;
  speed: number;
};

export default function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030603, 0.038);

    const camera = new THREE.PerspectiveCamera(
      46,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      220
    );
    camera.position.set(0, 6, 22);
    const camTarget = new THREE.Vector3(6.2, 3.2, 0);
    camera.lookAt(camTarget);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.3 : 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Everything sits inside `world` so it can be offset to the right of frame
    const world = new THREE.Group();
    const worldOriginX = isMobile ? 3.4 : 6.2;
    world.position.x = worldOriginX;
    scene.add(world);

    // ─── PERSPECTIVE GRID FLOOR ──────────────────────────────────────────────
    const gridSize = 42;
    const gridDiv = isMobile ? 26 : 44;
    const grid = new THREE.GridHelper(gridSize, gridDiv, 0x3a8a1a, 0x123a08);
    (grid.material as THREE.LineBasicMaterial).transparent = true;
    (grid.material as THREE.LineBasicMaterial).opacity = 0.32;
    (grid.material as THREE.LineBasicMaterial).depthWrite = false;
    grid.position.y = -2.4;
    world.add(grid);

    // A second, denser grid closer to the core for detail
    const gridInner = new THREE.GridHelper(14, isMobile ? 18 : 28, 0x8ee02d, 0x1e5210);
    (gridInner.material as THREE.LineBasicMaterial).transparent = true;
    (gridInner.material as THREE.LineBasicMaterial).opacity = 0.28;
    (gridInner.material as THREE.LineBasicMaterial).depthWrite = false;
    gridInner.position.y = -2.38;
    world.add(gridInner);

    // ─── CORE VOXEL CLOUD ────────────────────────────────────────────────────
    const coreCount = isMobile ? 3200 : 9000;
    const corePositions = new Float32Array(coreCount * 3);
    const coreTargets = new Float32Array(coreCount * 3);
    const coreColors = new Float32Array(coreCount * 3);
    const coreSizes = new Float32Array(coreCount);
    const corePhases = new Float32Array(coreCount);

    const cubeHalf = 3.1;
    const voxelStep = 0.15;
    const coreLiftY = 1.6;
    const tmpColor = new THREE.Color();

    for (let i = 0; i < coreCount; i++) {
      const isShell = Math.random() < 0.78;
      let x = 0;
      let y = 0;
      let z = 0;

      if (isShell) {
        const face = Math.floor(Math.random() * 6);
        const u = (Math.random() - 0.5) * 2 * cubeHalf;
        const v = (Math.random() - 0.5) * 2 * cubeHalf;
        if (face === 0) { x = cubeHalf; y = u; z = v; }
        else if (face === 1) { x = -cubeHalf; y = u; z = v; }
        else if (face === 2) { x = u; y = cubeHalf; z = v; }
        else if (face === 3) { x = u; y = -cubeHalf * 0.85; z = v; }
        else if (face === 4) { x = u; y = v; z = cubeHalf; }
        else { x = u; y = v; z = -cubeHalf; }

        x = Math.round(x / voxelStep) * voxelStep + (Math.random() - 0.5) * 0.04;
        y = Math.round(y / voxelStep) * voxelStep + (Math.random() - 0.5) * 0.04;
        z = Math.round(z / voxelStep) * voxelStep + (Math.random() - 0.5) * 0.04;
      } else {
        // Interior lattice — sparse voxel scaffolding
        x = (Math.round((Math.random() - 0.5) * 2 * cubeHalf / voxelStep)) * voxelStep;
        y = (Math.round((Math.random() - 0.5) * 2 * cubeHalf / voxelStep)) * voxelStep;
        z = (Math.round((Math.random() - 0.5) * 2 * cubeHalf / voxelStep)) * voxelStep;
      }

      // Scatter start — far, orbiting position (will assemble in)
      const scatterR = 14 + Math.random() * 24;
      const scatterAng = Math.random() * Math.PI * 2;
      corePositions[i * 3 + 0] = Math.cos(scatterAng) * scatterR;
      corePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      corePositions[i * 3 + 2] = Math.sin(scatterAng) * scatterR;

      coreTargets[i * 3 + 0] = x;
      coreTargets[i * 3 + 1] = y + coreLiftY;
      coreTargets[i * 3 + 2] = z;

      // Color: face-center tends white/lime, edges deeper. Small % pure white sparks.
      const distFromCenter = Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) / cubeHalf;
      const t = Math.pow(distFromCenter, 2.4);
      tmpColor.copy(LIME_DEEP).lerp(LIME, 0.35 + (1 - t) * 0.55);
      if (Math.random() < 0.04) tmpColor.copy(CORE_WHITE);
      coreColors[i * 3 + 0] = tmpColor.r;
      coreColors[i * 3 + 1] = tmpColor.g;
      coreColors[i * 3 + 2] = tmpColor.b;

      coreSizes[i] = 0.018 + Math.random() * 0.05;
      corePhases[i] = Math.random() * Math.PI * 2;
    }

    const coreGeom = new THREE.BufferGeometry();
    coreGeom.setAttribute("position", new THREE.BufferAttribute(corePositions, 3));
    coreGeom.setAttribute("aTarget", new THREE.BufferAttribute(coreTargets, 3));
    coreGeom.setAttribute("aColor", new THREE.BufferAttribute(coreColors, 3));
    coreGeom.setAttribute("aSize", new THREE.BufferAttribute(coreSizes, 1));
    coreGeom.setAttribute("aPhase", new THREE.BufferAttribute(corePhases, 1));

    const coreMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAssemble: { value: 0 },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aTarget;
        attribute vec3 aColor;
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uAssemble;
        uniform vec3 uMouse;
        uniform float uPixelRatio;
        varying vec3 vColor;
        varying float vPulse;
        void main() {
          vec3 base = mix(position, aTarget, uAssemble);

          // Micro-breathing of the whole core
          base += vec3(
            sin(uTime * 0.55 + aPhase) * 0.022,
            cos(uTime * 0.4 + aPhase * 1.6) * 0.026,
            sin(uTime * 0.7 + aPhase * 0.9) * 0.022
          );

          // Traveling energy wave up through the core
          float wave = smoothstep(0.0, 0.35, sin(uTime * 1.1 - aTarget.y * 0.9 + aPhase * 0.5));

          // Mouse repel in XY (local world-plane approximation)
          vec2 toMouse = base.xy - uMouse.xy;
          float md = length(toMouse);
          float infl = smoothstep(2.4, 0.0, md);
          base.xy += normalize(toMouse + vec2(0.0001)) * infl * 0.55;

          vec4 mv = modelViewMatrix * vec4(base, 1.0);
          vPulse = 0.45 + 0.55 * wave + infl * 0.6;
          vColor = aColor;
          gl_PointSize = aSize * 340.0 * uPixelRatio / max(-mv.z, 0.1);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vPulse;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float alpha = core * (0.55 + vPulse * 0.5);
          vec3 col = vColor * (0.85 + vPulse * 0.7);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const corePoints = new THREE.Points(coreGeom, coreMat);
    world.add(corePoints);

    // ─── VERTICAL DATA STREAMS ──────────────────────────────────────────────
    const streamCount = isMobile ? 22 : 58;
    const streamPos = new Float32Array(streamCount * 2 * 3);
    const streamData: StreamDatum[] = [];
    for (let i = 0; i < streamCount; i++) {
      // distribute in a right-side arc, avoiding the core footprint
      const r = 3.6 + Math.random() * 9;
      const ang = -Math.PI * 0.55 + Math.random() * Math.PI * 1.1;
      const bx = Math.cos(ang) * r;
      const bz = Math.sin(ang) * r * 0.7;
      // skip streams that would spawn inside the core box
      const insideCore =
        Math.abs(bx) < cubeHalf + 0.4 && Math.abs(bz) < cubeHalf + 0.4;
      const bxSafe = insideCore ? bx + Math.sign(bx || 1) * (cubeHalf + 0.6) : bx;
      const height = 1 + Math.random() * 4.5;
      streamData.push({
        bx: bxSafe,
        bz,
        height,
        phase: Math.random() * 4,
        speed: 0.35 + Math.random() * 0.9,
      });
      streamPos[i * 6 + 0] = bxSafe;
      streamPos[i * 6 + 1] = -2.4;
      streamPos[i * 6 + 2] = bz;
      streamPos[i * 6 + 3] = bxSafe;
      streamPos[i * 6 + 4] = -2.4 + height;
      streamPos[i * 6 + 5] = bz;
    }

    const streamGeom = new THREE.BufferGeometry();
    streamGeom.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
    const streamMat = new THREE.LineBasicMaterial({
      color: 0x9dff3f,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streams = new THREE.LineSegments(streamGeom, streamMat);
    world.add(streams);

    // ─── AMBIENT DRIFTING PARTICLES ─────────────────────────────────────────
    const ambCount = isMobile ? 420 : 1250;
    const ambPos = new Float32Array(ambCount * 3);
    const ambSize = new Float32Array(ambCount);
    const ambPhase = new Float32Array(ambCount);
    for (let i = 0; i < ambCount; i++) {
      const r = 6 + Math.random() * 20;
      const ang = -Math.PI * 0.7 + Math.random() * Math.PI * 1.4;
      ambPos[i * 3 + 0] = Math.cos(ang) * r;
      ambPos[i * 3 + 1] = -1.5 + Math.random() * 8;
      ambPos[i * 3 + 2] = Math.sin(ang) * r * 0.55 - 3;
      ambSize[i] = 0.6 + Math.random() * 1.8;
      ambPhase[i] = Math.random() * Math.PI * 2;
    }
    const ambGeom = new THREE.BufferGeometry();
    ambGeom.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
    ambGeom.setAttribute("aSize", new THREE.BufferAttribute(ambSize, 1));
    ambGeom.setAttribute("aPhase", new THREE.BufferAttribute(ambPhase, 1));

    const ambMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vA;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.28 + aPhase) * 0.35;
          p.x += cos(uTime * 0.22 + aPhase * 1.3) * 0.25;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vA = 0.35 + 0.4 * sin(uTime * 0.6 + aPhase);
          gl_PointSize = aSize * uPixelRatio * 55.0 / max(-mv.z, 0.1);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vA * 0.55;
          gl_FragColor = vec4(0.62, 1.0, 0.38, a);
        }
      `,
    });
    const ambient = new THREE.Points(ambGeom, ambMat);
    world.add(ambient);

    // ─── MOUSE / POINTER ─────────────────────────────────────────────────────
    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    if (!isCoarse) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ─── RESIZE ──────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ─── ANIMATION LOOP ──────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let assemble = 0;

    const ndc = new THREE.Vector3();
    const worldMouse = new THREE.Vector3();

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      assemble = Math.min(1, assemble + (reduceMotion ? 0.02 : 0.006));

      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.05;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.05;

      // Layered parallax on camera + world
      camera.position.x = smoothPointer.x * 1.8;
      camera.position.y = 6 + smoothPointer.y * 0.9;
      camTarget.set(
        worldOriginX + smoothPointer.x * 0.6,
        3.2 + smoothPointer.y * 0.5,
        0
      );
      camera.lookAt(camTarget);

      world.position.x = worldOriginX + smoothPointer.x * 0.35;
      world.position.y = smoothPointer.y * 0.25;
      world.rotation.y = smoothPointer.x * 0.09 + Math.sin(t * 0.08) * 0.015;

      // Project cursor onto the core Z=0 plane (in local world-group space)
      ndc.set(smoothPointer.x, smoothPointer.y, 0.5).unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      if (Math.abs(dir.z) > 1e-4) {
        const dist = -camera.position.z / dir.z;
        worldMouse.copy(camera.position).addScaledVector(dir, dist);
        coreMat.uniforms.uMouse.value.set(
          worldMouse.x - world.position.x,
          worldMouse.y - world.position.y,
          0
        );
      }

      coreMat.uniforms.uTime.value = t;
      coreMat.uniforms.uAssemble.value = easeOutCubic(assemble);
      ambMat.uniforms.uTime.value = t;

      // Rising data-stream pulses
      const positions = streamGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < streamCount; i++) {
        const s = streamData[i];
        const cyc = ((t * s.speed + s.phase) % 2) - 0.4;
        const p = Math.max(0, Math.min(1, cyc));
        positions[i * 6 + 1] = -2.4;
        positions[i * 6 + 4] = -2.4 + s.height * p;
      }
      streamGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);

      if (running) raf = requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (running) return;
      running = true;
      clock.getDelta();
      raf = requestAnimationFrame(renderFrame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { rootMargin: "200px" }
    );
    io.observe(mount);

    if (reduceMotion) {
      // draw a single static frame in the assembled state
      assemble = 1;
      renderFrame();
    } else {
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      if (!isCoarse) window.removeEventListener("pointermove", onPointerMove);
      coreGeom.dispose();
      coreMat.dispose();
      streamGeom.dispose();
      streamMat.dispose();
      ambGeom.dispose();
      ambMat.dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      gridInner.geometry.dispose();
      (gridInner.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 vx-hero-ambient" />
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 vx-hero-core-glow" />
    </div>
  );
}
