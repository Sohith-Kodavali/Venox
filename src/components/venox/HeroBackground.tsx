"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { VX_LOADED_EVENT } from "./useLoaded";

const LIME = new THREE.Color("#9dff3f");
const LIME_SOFT = new THREE.Color("#c8ff86");
const TEAL = new THREE.Color("#4ffbc6");
const CORE_WHITE = new THREE.Color("#e6ffb8");
const EMERALD = new THREE.Color("#3fbf7f");

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

// ─── SHADERS ──────────────────────────────────────────────────────────────

const NUCLEUS_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aRadius;
  attribute vec3  aAxis;      // orbital plane normal (unit)
  attribute vec3  aColor;
  attribute float aSpeed;
  uniform float uTime;
  uniform float uAssemble;
  uniform float uPixelRatio;
  uniform vec3  uMouse;
  varying vec3 vColor;
  varying float vPulse;

  // Build orthonormal basis from a unit axis n
  mat3 basis(vec3 n) {
    vec3 a = abs(n.x) < 0.9 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 t = normalize(cross(a, n));
    vec3 b = cross(n, t);
    return mat3(t, b, n);
  }

  void main() {
    float ang = aPhase + uTime * aSpeed;
    vec3 local = vec3(cos(ang) * aRadius, sin(ang) * aRadius, 0.0);
    // slight radial breathing
    local *= 0.98 + 0.04 * sin(uTime * 0.6 + aPhase * 1.3);
    mat3 m = basis(normalize(aAxis));
    vec3 world = m * local;
    // assemble from far scatter
    vec3 scatter = normalize(aAxis + vec3(sin(aPhase), cos(aPhase * 1.3), sin(aPhase * 0.7))) * (aRadius + 6.0);
    vec3 pos = mix(scatter, world, uAssemble);

    // mouse repel
    vec2 toM = pos.xy - uMouse.xy;
    float md = length(toM);
    float infl = smoothstep(2.6, 0.0, md);
    pos.xy += normalize(toM + vec2(0.0001)) * infl * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vPulse = 0.55 + 0.45 * sin(uTime * 1.2 + aPhase * 2.0) + infl * 0.5;
    vColor = aColor;
    gl_PointSize = aSize * 340.0 * uPixelRatio / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;

const NUCLEUS_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vPulse;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.05, d);
    float alpha = core * (0.55 + vPulse * 0.5);
    vec3 col = vColor * (0.85 + vPulse * 0.75);
    gl_FragColor = vec4(col, alpha);
  }
`;

const CONST_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  varying float vA;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.24 + aPhase) * 0.35;
    p.y += cos(uTime * 0.19 + aPhase * 1.3) * 0.28;
    p.z += sin(uTime * 0.15 + aPhase * 0.7) * 0.25;

    vec2 toM = p.xy - uMouse.xy;
    float md = length(toM);
    float infl = smoothstep(2.8, 0.0, md);
    p.xy += normalize(toM + vec2(0.0001)) * infl * 0.5;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vA = 0.35 + 0.5 * sin(uTime * 0.7 + aPhase) + infl * 0.4;
    vColor = aColor;
    gl_PointSize = aSize * uPixelRatio * 90.0 / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;

const CONST_FRAG = /* glsl */ `
  varying float vA;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float alpha = core * clamp(vA, 0.0, 1.2) * 0.7;
    gl_FragColor = vec4(vColor * (0.7 + vA * 0.6), alpha);
  }
`;

// Ribbon / filament (thick line via triangle strip)
const RIBBON_VERT = /* glsl */ `
  attribute float aT;      // 0..1 along ribbon
  attribute float aSide;   // -1 or +1 for edge offset
  uniform float uTime;
  uniform float uAssemble;
  uniform vec3  uSeed;     // per-ribbon offsets
  uniform vec3  uAmp;      // per-ribbon amplitudes
  uniform vec3  uFreq;     // per-ribbon frequencies
  uniform vec3  uCenter;   // ribbon center in world
  uniform float uLength;   // ribbon length (along X)
  uniform float uWidth;    // ribbon half-width
  varying float vT;

  vec3 samplePath(float t) {
    float x = (t - 0.5) * uLength;
    float y =
      sin(uTime * uFreq.x + uSeed.x + t * 6.283) * uAmp.x +
      cos(uTime * uFreq.y * 0.7 + uSeed.y + t * 12.566) * uAmp.y * 0.5;
    float z =
      sin(uTime * uFreq.z * 0.6 + uSeed.z + t * 4.19) * uAmp.z;
    return uCenter + vec3(x, y, z);
  }

  void main() {
    vT = aT;
    vec3 p0 = samplePath(aT);
    vec3 p1 = samplePath(clamp(aT + 0.005, 0.0, 1.0));
    vec3 tangent = normalize(p1 - p0 + vec3(0.0, 0.00001, 0.0));
    // normal in XY plane, tilted slightly out of plane
    vec3 up = vec3(0.0, 0.0, 1.0);
    vec3 normal = normalize(cross(tangent, up));
    // Width shaped by taper
    float taper = sin(aT * 3.14159);
    vec3 pos = p0 + normal * aSide * uWidth * taper;
    // assemble
    pos = mix(uCenter + vec3((aT - 0.5) * uLength * 0.2, 0.0, 0.0), pos, uAssemble);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const RIBBON_FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uTime;
  uniform float uOpacity;
  varying float vT;
  void main() {
    float shimmer = 0.6 + 0.4 * sin(vT * 22.0 - uTime * 2.4);
    float ends = smoothstep(0.0, 0.08, vT) * smoothstep(1.0, 0.92, vT);
    vec3 col = mix(uColorA, uColorB, vT) * shimmer;
    float a = ends * 0.5 * uOpacity;
    gl_FragColor = vec4(col, a);
  }
`;

// ─── GENERATORS ────────────────────────────────────────────────────────────

function generateNucleus(desktop: boolean) {
  // Multiple orbital rings at different tilts around a shared center.
  // Each ring contributes points; overall reads as a luminous nucleus.
  const rings = desktop
    ? [
        { r: 1.15, count: 380, tilt: [0.9, 0.2, 0.35], speed: 0.35, sizeBase: 0.045, color: CORE_WHITE, whiteChance: 0.3 },
        { r: 1.55, count: 460, tilt: [0.2, 0.9, -0.35], speed: -0.25, sizeBase: 0.04, color: LIME_SOFT, whiteChance: 0.15 },
        { r: 2.05, count: 520, tilt: [-0.35, 0.4, 0.85], speed: 0.18, sizeBase: 0.036, color: LIME, whiteChance: 0.08 },
        { r: 2.6,  count: 560, tilt: [0.75, -0.55, 0.35], speed: -0.14, sizeBase: 0.032, color: TEAL, whiteChance: 0.05 },
        { r: 3.15, count: 600, tilt: [0.15, 0.6, -0.78], speed: 0.11, sizeBase: 0.028, color: EMERALD, whiteChance: 0.03 },
        { r: 3.75, count: 620, tilt: [-0.6, 0.55, 0.55], speed: -0.08, sizeBase: 0.024, color: LIME, whiteChance: 0.02 },
      ]
    : [
        { r: 1.15, count: 180, tilt: [0.9, 0.2, 0.35], speed: 0.35, sizeBase: 0.045, color: CORE_WHITE, whiteChance: 0.3 },
        { r: 1.7,  count: 220, tilt: [0.2, 0.9, -0.35], speed: -0.22, sizeBase: 0.04, color: LIME_SOFT, whiteChance: 0.12 },
        { r: 2.4,  count: 260, tilt: [-0.35, 0.4, 0.85], speed: 0.16, sizeBase: 0.034, color: LIME, whiteChance: 0.06 },
        { r: 3.1,  count: 300, tilt: [0.75, -0.55, 0.35], speed: -0.12, sizeBase: 0.028, color: TEAL, whiteChance: 0.03 },
      ];

  const total = rings.reduce((s, r) => s + r.count, 0);
  const sizes = new Float32Array(total);
  const phases = new Float32Array(total);
  const radii = new Float32Array(total);
  const axes = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const speeds = new Float32Array(total);
  // position attribute unused directly (shader uses ring math) but required by three
  const positions = new Float32Array(total * 3);

  const tmp = new THREE.Color();
  let i = 0;
  for (const ring of rings) {
    const [ax, ay, az] = ring.tilt;
    const alen = Math.hypot(ax, ay, az) || 1;
    const nx = ax / alen;
    const ny = ay / alen;
    const nz = az / alen;
    for (let k = 0; k < ring.count; k++) {
      radii[i] = ring.r * (0.94 + Math.random() * 0.12);
      phases[i] = Math.random() * Math.PI * 2;
      axes[i * 3 + 0] = nx + (Math.random() - 0.5) * 0.06;
      axes[i * 3 + 1] = ny + (Math.random() - 0.5) * 0.06;
      axes[i * 3 + 2] = nz + (Math.random() - 0.5) * 0.06;
      speeds[i] = ring.speed * (0.85 + Math.random() * 0.3);
      sizes[i] = ring.sizeBase * (0.7 + Math.random() * 0.8);

      if (Math.random() < ring.whiteChance) tmp.copy(CORE_WHITE);
      else tmp.copy(ring.color).lerp(CORE_WHITE, Math.random() * 0.25);
      colors[i * 3 + 0] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
      i++;
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geom.setAttribute("aRadius", new THREE.BufferAttribute(radii, 1));
  geom.setAttribute("aAxis", new THREE.BufferAttribute(axes, 3));
  geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geom.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  return geom;
}

function generateConstellation(desktop: boolean) {
  const count = desktop ? 520 : 220;
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const color = new Float32Array(count * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // Bias distribution toward the right side + broad depth
    const r = 4 + Math.pow(Math.random(), 0.7) * 18;
    const angBias = -Math.PI * 0.75 + Math.random() * Math.PI * 1.55;
    pos[i * 3 + 0] = Math.cos(angBias) * r;
    pos[i * 3 + 1] = -1 + Math.random() * 8.5;
    pos[i * 3 + 2] = Math.sin(angBias) * r * 0.55 - 2;

    const roll = Math.random();
    if (roll < 0.06) tmp.copy(CORE_WHITE);
    else if (roll < 0.22) tmp.copy(LIME_SOFT);
    else if (roll < 0.55) tmp.copy(LIME);
    else if (roll < 0.8) tmp.copy(EMERALD);
    else tmp.copy(TEAL);
    color[i * 3 + 0] = tmp.r;
    color[i * 3 + 1] = tmp.g;
    color[i * 3 + 2] = tmp.b;

    size[i] = 0.55 + Math.random() * 1.9;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  g.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  return g;
}

function makeRibbonGeometry(segments: number) {
  // Triangle strip: 2 vertices per segment (side = -1, +1)
  const count = (segments + 1) * 2;
  const t = new Float32Array(count);
  const side = new Float32Array(count);
  const pos = new Float32Array(count * 3); // required but unused for CPU-side math
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    t[i * 2 + 0] = u;
    t[i * 2 + 1] = u;
    side[i * 2 + 0] = -1;
    side[i * 2 + 1] = 1;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aT", new THREE.BufferAttribute(t, 1));
  g.setAttribute("aSide", new THREE.BufferAttribute(side, 1));
  g.setIndex(null);
  return g;
}

function makeBloomTexture(): THREE.Texture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, "rgba(230, 255, 184, 1)");
  grad.addColorStop(0.08, "rgba(200, 255, 134, 0.9)");
  grad.addColorStop(0.22, "rgba(157, 255, 63, 0.55)");
  grad.addColorStop(0.5, "rgba(79, 251, 198, 0.14)");
  grad.addColorStop(0.75, "rgba(30, 100, 66, 0.04)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────

export default function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 768;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    // ── scene / camera / renderer ──────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a2418, 0.03);

    const camera = new THREE.PerspectiveCamera(
      44,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      240
    );
    camera.position.set(0, 3.2, 16);
    const camTarget = new THREE.Vector3(4.6, 2.6, 0);
    camera.lookAt(camTarget);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: isDesktop,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isDesktop ? 1.5 : 1.1));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    const worldOriginX = isDesktop ? 4.6 : 2.4;
    world.position.set(worldOriginX, 2.3, 0);
    scene.add(world);

    // ── NUCLEUS (orbital constellation) ────────────────────────────────────
    const nucleusGeom = generateNucleus(isDesktop);
    const nucleusMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAssemble: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: NUCLEUS_VERT,
      fragmentShader: NUCLEUS_FRAG,
    });
    const nucleus = new THREE.Points(nucleusGeom, nucleusMat);
    world.add(nucleus);

    // ── CENTRAL BLOOM SPRITE (behind nucleus) ──────────────────────────────
    const bloomTex = makeBloomTexture();
    const bloomOuterMat = new THREE.SpriteMaterial({
      map: bloomTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      color: 0xffffff,
    });
    const bloomOuter = new THREE.Sprite(bloomOuterMat);
    bloomOuter.scale.set(isDesktop ? 14 : 9, isDesktop ? 14 : 9, 1);
    bloomOuter.position.set(0, 0, -1.5);
    world.add(bloomOuter);

    const bloomInnerMat = new THREE.SpriteMaterial({
      map: bloomTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
      color: 0xdcffb0,
    });
    const bloomInner = new THREE.Sprite(bloomInnerMat);
    bloomInner.scale.set(isDesktop ? 5.5 : 3.8, isDesktop ? 5.5 : 3.8, 1);
    bloomInner.position.set(0, 0, 0.4);
    world.add(bloomInner);

    // ── CONSTELLATION (ambient floating stars) ─────────────────────────────
    const constGeom = generateConstellation(isDesktop);
    const constMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uMouse: { value: new THREE.Vector3() },
      },
      vertexShader: CONST_VERT,
      fragmentShader: CONST_FRAG,
    });
    const constellation = new THREE.Points(constGeom, constMat);
    // constellation lives in a parent group so we can offset its origin
    const constHost = new THREE.Group();
    constHost.position.set(-worldOriginX, -2.3, 0); // move back to world (0,0,0) frame
    constHost.add(constellation);
    world.add(constHost);

    // ── ENERGY FILAMENTS (flowing ribbons) ─────────────────────────────────
    type RibbonDef = {
      center: THREE.Vector3;
      length: number;
      width: number;
      amp: THREE.Vector3;
      freq: THREE.Vector3;
      seed: THREE.Vector3;
      colorA: THREE.Color;
      colorB: THREE.Color;
      opacity: number;
    };

    const ribbonDefs: RibbonDef[] = isDesktop
      ? [
          {
            center: new THREE.Vector3(0.5, 1.6, -0.5),
            length: 22,
            width: 0.18,
            amp: new THREE.Vector3(0.9, 0.4, 0.55),
            freq: new THREE.Vector3(0.35, 0.5, 0.28),
            seed: new THREE.Vector3(0.4, 1.2, 2.1),
            colorA: LIME,
            colorB: TEAL,
            opacity: 0.7,
          },
          {
            center: new THREE.Vector3(-0.3, -0.6, 0.6),
            length: 24,
            width: 0.14,
            amp: new THREE.Vector3(0.8, 0.55, 0.35),
            freq: new THREE.Vector3(0.28, 0.42, 0.32),
            seed: new THREE.Vector3(2.6, 0.7, 4.2),
            colorA: TEAL,
            colorB: LIME_SOFT,
            opacity: 0.55,
          },
          {
            center: new THREE.Vector3(0.2, 0.9, 1.4),
            length: 18,
            width: 0.11,
            amp: new THREE.Vector3(0.5, 0.7, 0.25),
            freq: new THREE.Vector3(0.5, 0.32, 0.22),
            seed: new THREE.Vector3(3.7, 5.1, 0.9),
            colorA: LIME_SOFT,
            colorB: CORE_WHITE,
            opacity: 0.45,
          },
          {
            center: new THREE.Vector3(0.7, 2.5, -1.2),
            length: 20,
            width: 0.09,
            amp: new THREE.Vector3(0.6, 0.35, 0.4),
            freq: new THREE.Vector3(0.4, 0.55, 0.35),
            seed: new THREE.Vector3(1.9, 3.3, 5.4),
            colorA: EMERALD,
            colorB: LIME,
            opacity: 0.35,
          },
        ]
      : [
          {
            center: new THREE.Vector3(0.2, 1.4, -0.4),
            length: 18,
            width: 0.15,
            amp: new THREE.Vector3(0.8, 0.4, 0.45),
            freq: new THREE.Vector3(0.35, 0.5, 0.28),
            seed: new THREE.Vector3(0.4, 1.2, 2.1),
            colorA: LIME,
            colorB: TEAL,
            opacity: 0.6,
          },
          {
            center: new THREE.Vector3(-0.4, -0.4, 0.6),
            length: 20,
            width: 0.12,
            amp: new THREE.Vector3(0.7, 0.5, 0.3),
            freq: new THREE.Vector3(0.28, 0.42, 0.32),
            seed: new THREE.Vector3(2.6, 0.7, 4.2),
            colorA: TEAL,
            colorB: LIME_SOFT,
            opacity: 0.45,
          },
        ];

    const ribbonMeshes: THREE.Mesh[] = [];
    const ribbonMats: THREE.ShaderMaterial[] = [];
    const ribbonSegments = isDesktop ? 96 : 60;
    for (const def of ribbonDefs) {
      const g = makeRibbonGeometry(ribbonSegments);
      const m = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uAssemble: { value: 0 },
          uSeed: { value: def.seed },
          uAmp: { value: def.amp },
          uFreq: { value: def.freq },
          uCenter: { value: def.center },
          uLength: { value: def.length },
          uWidth: { value: def.width },
          uColorA: { value: def.colorA },
          uColorB: { value: def.colorB },
          uOpacity: { value: def.opacity },
        },
        vertexShader: RIBBON_VERT,
        fragmentShader: RIBBON_FRAG,
      });
      const mesh = new THREE.Mesh(g, m);
      // triangle strip
      (mesh as unknown as { drawMode?: number }).drawMode = THREE.TriangleStripDrawMode;
      mesh.renderOrder = -1;
      world.add(mesh);
      ribbonMeshes.push(mesh);
      ribbonMats.push(m);
    }

    // ── POINTER ────────────────────────────────────────────────────────────
    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    if (!isCoarse) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ── RESIZE ─────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ── LOOP ───────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let assemble = 0;

    // Cinematic camera dolly: starts CLOSE (mid-scene) and pulls BACK
    // to reveal, coordinated with the loading-screen zoom-through exit.
    const CAM_START = { x: 0, y: 4.6, z: isDesktop ? 8 : 6.5 };
    const CAM_END = { x: 0, y: 3.2, z: isDesktop ? 16 : 13 };
    const WORLD_END_X = worldOriginX;
    const WORLD_END_Y = 2.3;

    let entryStarted = false;
    let entryStartT = 0;
    const ENTRY_DUR = 2.2;

    const triggerEntry = () => {
      if (entryStarted) return;
      entryStarted = true;
      entryStartT = clock.getElapsedTime();
    };
    window.addEventListener(VX_LOADED_EVENT, triggerEntry);
    if (reduceMotion) triggerEntry();
    // Safety fallback so scene doesn't stay frozen if the event never fires
    const entryFallback = window.setTimeout(triggerEntry, 3400);

    const ndc = new THREE.Vector3();
    const worldMouse = new THREE.Vector3();

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      const dtEntry = entryStarted ? Math.min(1, (t - entryStartT) / ENTRY_DUR) : 0;
      const entry = easeOutCubic(dtEntry);
      assemble = entry;
      const a = entry;

      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.05;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.05;

      // Base camera pose interpolates from CAM_START → CAM_END, then adds parallax
      const baseCamX = CAM_START.x + (CAM_END.x - CAM_START.x) * entry;
      const baseCamY = CAM_START.y + (CAM_END.y - CAM_START.y) * entry;
      const baseCamZ = CAM_START.z + (CAM_END.z - CAM_START.z) * entry;
      camera.position.x = baseCamX + smoothPointer.x * 1.5 * entry;
      camera.position.y = baseCamY + smoothPointer.y * 0.8 * entry;
      camera.position.z = baseCamZ;

      // Look target also interpolates so composition frames well during dolly
      const tgtX = worldOriginX * entry + smoothPointer.x * 0.6 * entry;
      const tgtY = 2.6 * entry + smoothPointer.y * 0.4 * entry;
      camTarget.set(tgtX, tgtY, 0);
      camera.lookAt(camTarget);

      // World also gently zooms UP from smaller scale during entry
      const worldScale = 0.82 + 0.18 * entry;
      world.scale.setScalar(worldScale);
      world.position.x = WORLD_END_X + smoothPointer.x * 0.25 * entry;
      world.position.y = WORLD_END_Y + smoothPointer.y * 0.2 * entry;
      world.rotation.y = smoothPointer.x * 0.06 * entry + Math.sin(t * 0.06) * 0.012;

      // Project cursor to world plane at world z=0
      ndc.set(smoothPointer.x, smoothPointer.y, 0.5).unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      let localMx = 0;
      let localMy = 0;
      if (Math.abs(dir.z) > 1e-4) {
        const dist = -camera.position.z / dir.z;
        worldMouse.copy(camera.position).addScaledVector(dir, dist);
        localMx = worldMouse.x - world.position.x;
        localMy = worldMouse.y - world.position.y;
      }
      nucleusMat.uniforms.uMouse.value.set(localMx, localMy, 0);
      constMat.uniforms.uMouse.value.set(worldMouse.x, worldMouse.y, 0);

      nucleusMat.uniforms.uTime.value = t;
      nucleusMat.uniforms.uAssemble.value = a;
      constMat.uniforms.uTime.value = t;

      for (const rm of ribbonMats) {
        rm.uniforms.uTime.value = t;
        rm.uniforms.uAssemble.value = a;
      }

      // Central bloom breathing — hidden until the entry starts revealing
      const bp = 0.85 + Math.sin(t * 1.2) * 0.08;
      bloomOuter.material.opacity = entry * bp * 0.85;
      bloomInner.material.opacity = entry * (0.9 + Math.sin(t * 2.0) * 0.1);
      const sOuter = (isDesktop ? 14 : 9) * (0.98 + Math.sin(t * 0.9) * 0.03);
      bloomOuter.scale.set(sOuter, sOuter, 1);

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
      entryStarted = true;
      entryStartT = -ENTRY_DUR; // clamp to fully-assembled from frame one
      renderFrame();
    } else {
      start();
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener(VX_LOADED_EVENT, triggerEntry);
      window.clearTimeout(entryFallback);
      if (!isCoarse) window.removeEventListener("pointermove", onPointerMove);

      nucleusGeom.dispose();
      nucleusMat.dispose();
      constGeom.dispose();
      constMat.dispose();
      for (const mesh of ribbonMeshes) mesh.geometry.dispose();
      for (const mat of ribbonMats) mat.dispose();
      bloomTex.dispose();
      bloomOuterMat.dispose();
      bloomInnerMat.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 vx-hero-base" />
      <div className="vx-hero-aurora">
        <div className="vx-hero-aurora-blob a" />
        <div className="vx-hero-aurora-blob b" />
        <div className="vx-hero-aurora-blob c" />
        <div className="vx-hero-aurora-blob d" />
      </div>
      <div className="absolute inset-0 vx-hero-ambient" />
      <div ref={mountRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 vx-hero-core-glow" />
      <div className="vx-hero-vignette" />
    </div>
  );
}
