"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const LIME = new THREE.Color("#9dff3f");
const LIME_MID = new THREE.Color("#66bd22");
const LIME_DEEP = new THREE.Color("#264f12");
const CORE_WHITE = new THREE.Color("#e6ffb8");
const CYAN_HINT = new THREE.Color("#4ffbc6");

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

type StreamDatum = {
  bx: number;
  bz: number;
  height: number;
  phase: number;
  speed: number;
};

const CORE_VERT = /* glsl */ `
  attribute vec3 aTarget;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aPhase;
  attribute float aEdge;
  uniform float uTime;
  uniform float uAssemble;
  uniform vec3 uMouse;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vPulse;
  varying float vEdge;
  void main() {
    vec3 base = mix(position, aTarget, uAssemble);
    // breathing micro-motion
    base += vec3(
      sin(uTime * 0.45 + aPhase) * 0.02,
      cos(uTime * 0.32 + aPhase * 1.6) * 0.025,
      sin(uTime * 0.55 + aPhase * 0.9) * 0.02
    );
    // rising energy wave through the core
    float wave = smoothstep(0.0, 0.45, sin(uTime * 1.15 - aTarget.y * 0.85 + aPhase * 0.4));
    // mouse repulsion
    vec2 toM = base.xy - uMouse.xy;
    float md = length(toM);
    float infl = smoothstep(2.8, 0.0, md);
    base.xy += normalize(toM + vec2(0.0001)) * infl * 0.55;

    vec4 mv = modelViewMatrix * vec4(base, 1.0);
    vPulse = 0.42 + 0.55 * wave + infl * 0.65;
    vColor = aColor;
    vEdge = aEdge;
    gl_PointSize = aSize * 360.0 * uPixelRatio / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;

const CORE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vPulse;
  varying float vEdge;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.05, d);
    float alpha = core * (0.5 + vPulse * 0.55);
    vec3 col = vColor * (0.75 + vPulse * 0.85 + vEdge * 0.35);
    gl_FragColor = vec4(col, alpha);
  }
`;

const CITY_VERT = /* glsl */ `
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
    // tiny drift
    base.y += sin(uTime * 0.4 + aPhase) * 0.008;
    // per-building pulse (grouped via phase)
    float pulse = 0.5 + 0.5 * sin(uTime * 0.9 + aPhase * 6.283);
    // subtle mouse displacement
    vec2 toM = base.xy - uMouse.xy;
    float md = length(toM);
    float infl = smoothstep(3.2, 0.0, md);
    base.xy += normalize(toM + vec2(0.0001)) * infl * 0.25;

    vec4 mv = modelViewMatrix * vec4(base, 1.0);
    vPulse = 0.45 + 0.45 * pulse + infl * 0.5;
    vColor = aColor;
    gl_PointSize = aSize * 300.0 * uPixelRatio / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;

const CITY_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vPulse;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.05, d);
    float alpha = core * (0.55 + vPulse * 0.4);
    vec3 col = vColor * (0.75 + vPulse * 0.7);
    gl_FragColor = vec4(col, alpha);
  }
`;

const GROUND_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vA;
  void main() {
    vec3 p = position;
    // faint shimmer on the ground
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vA = 0.4 + 0.4 * sin(uTime * 0.7 + aPhase);
    gl_PointSize = aSize * uPixelRatio * 42.0 / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;

const GROUND_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vA * 0.55;
    gl_FragColor = vec4(0.55, 0.95, 0.35, a);
  }
`;

const AMB_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.28 + aPhase) * 0.4;
    p.x += cos(uTime * 0.22 + aPhase * 1.3) * 0.3;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vA = 0.3 + 0.4 * sin(uTime * 0.55 + aPhase);
    gl_PointSize = aSize * uPixelRatio * 55.0 / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;

const AMB_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vA * 0.5;
    gl_FragColor = vec4(0.62, 1.0, 0.38, a);
  }
`;

// ─── GENERATORS ────────────────────────────────────────────────────────────

function generateMonolith(desktop: boolean) {
  const half = 3.2;
  const voxel = 0.16;

  // Concentrate mass along the 12 edges → gives cinematic "wireframe cube"
  // silhouette; add a lighter shell across faces for surface texture.
  const edgePairs: [number, number, number, number, number, number][] = [
    // bottom rect
    [-1, -1, -1, 1, -1, -1], [1, -1, -1, 1, -1, 1], [1, -1, 1, -1, -1, 1], [-1, -1, 1, -1, -1, -1],
    // top rect
    [-1, 1, -1, 1, 1, -1], [1, 1, -1, 1, 1, 1], [1, 1, 1, -1, 1, 1], [-1, 1, 1, -1, 1, -1],
    // verticals
    [-1, -1, -1, -1, 1, -1], [1, -1, -1, 1, 1, -1], [1, -1, 1, 1, 1, 1], [-1, -1, 1, -1, 1, 1],
  ];

  const edgeCount = desktop ? 4200 : 1600;
  const faceCount = desktop ? 3600 : 1400;
  const total = edgeCount + faceCount;

  const positions = new Float32Array(total * 3);
  const targets = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const phases = new Float32Array(total);
  const edgeFlag = new Float32Array(total);
  const tmp = new THREE.Color();

  // Edges
  for (let i = 0; i < edgeCount; i++) {
    const [ax, ay, az, bx, by, bz] = edgePairs[i % 12];
    const t = Math.random();
    let x = (ax + (bx - ax) * t) * half;
    let y = (ay + (by - ay) * t) * half;
    let z = (az + (bz - az) * t) * half;
    // add jitter perpendicular to edge for thickness
    x += (Math.random() - 0.5) * 0.18;
    y += (Math.random() - 0.5) * 0.18;
    z += (Math.random() - 0.5) * 0.18;
    // discretize
    x = Math.round(x / voxel) * voxel;
    y = Math.round(y / voxel) * voxel;
    z = Math.round(z / voxel) * voxel;

    targets[i * 3 + 0] = x;
    targets[i * 3 + 1] = y + 1.4; // lift so cube base sits above ground
    targets[i * 3 + 2] = z;

    // scatter start
    const r = 16 + Math.random() * 22;
    const a = Math.random() * Math.PI * 2;
    positions[i * 3 + 0] = Math.cos(a) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = Math.sin(a) * r;

    // brighter, whiter at edges
    tmp.copy(LIME).lerp(CORE_WHITE, 0.15 + Math.random() * 0.35);
    if (Math.random() < 0.06) tmp.copy(CORE_WHITE);
    colors[i * 3 + 0] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;

    sizes[i] = 0.028 + Math.random() * 0.05;
    phases[i] = Math.random() * Math.PI * 2;
    edgeFlag[i] = 1;
  }

  // Faces: sparse pixel skin so the cube reads as solid but dark
  for (let i = 0; i < faceCount; i++) {
    const idx = edgeCount + i;
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() - 0.5) * 2 * half;
    const v = (Math.random() - 0.5) * 2 * half;
    let x = 0;
    let y = 0;
    let z = 0;
    if (face === 0) { x = half; y = u; z = v; }
    else if (face === 1) { x = -half; y = u; z = v; }
    else if (face === 2) { x = u; y = half; z = v; }
    else if (face === 3) { x = u; y = -half; z = v; }
    else if (face === 4) { x = u; y = v; z = half; }
    else { x = u; y = v; z = -half; }

    x = Math.round(x / voxel) * voxel;
    y = Math.round(y / voxel) * voxel;
    z = Math.round(z / voxel) * voxel;

    targets[idx * 3 + 0] = x;
    targets[idx * 3 + 1] = y + 1.4;
    targets[idx * 3 + 2] = z;

    const r = 16 + Math.random() * 22;
    const a = Math.random() * Math.PI * 2;
    positions[idx * 3 + 0] = Math.cos(a) * r;
    positions[idx * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[idx * 3 + 2] = Math.sin(a) * r;

    // face pixels: mid-lime with occasional deep tones
    tmp.copy(LIME_MID).lerp(LIME_DEEP, Math.random() * 0.65);
    if (Math.random() < 0.03) tmp.copy(LIME);
    colors[idx * 3 + 0] = tmp.r;
    colors[idx * 3 + 1] = tmp.g;
    colors[idx * 3 + 2] = tmp.b;

    sizes[idx] = 0.017 + Math.random() * 0.03;
    phases[idx] = Math.random() * Math.PI * 2;
    edgeFlag[idx] = 0;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geom.setAttribute("aEdge", new THREE.BufferAttribute(edgeFlag, 1));
  return geom;
}

type Building = { x: number; z: number; w: number; d: number; h: number; phase: number };

function generateBuildings(desktop: boolean) {
  // Distribute rectangular "skyscrapers" in a right-side arc.
  // Avoid the central monolith footprint (half=3.2).
  const buildings: Building[] = [];
  const target = desktop ? 26 : 12;
  const coreHalf = 3.3;
  let attempts = 0;
  while (buildings.length < target && attempts < 400) {
    attempts++;
    // Position: ring around core, biased to right/back
    const r = 3.9 + Math.random() * 8.5;
    const ang = -Math.PI * 0.55 + Math.random() * Math.PI * 1.1;
    const x = Math.cos(ang) * r;
    const z = Math.sin(ang) * r * 0.75 - 0.6;
    // Skip if inside core footprint
    if (Math.abs(x) < coreHalf + 0.3 && Math.abs(z) < coreHalf + 0.3) continue;
    const w = 0.35 + Math.random() * 1.05;
    const d = 0.35 + Math.random() * 0.9;
    // Skyscrapers: bias toward tall
    const tallBias = Math.pow(Math.random(), 0.55);
    const h = 1.1 + tallBias * 6.2;

    // Reject if overlaps another building
    let ok = true;
    for (const b of buildings) {
      const dx = Math.abs(x - b.x);
      const dz = Math.abs(z - b.z);
      if (dx < (w + b.w) * 0.6 && dz < (d + b.d) * 0.6) { ok = false; break; }
    }
    if (!ok) continue;
    buildings.push({ x, z, w, d, h, phase: Math.random() });
  }

  // Now generate per-building particle clouds on the 4 vertical faces
  // with a fine "window" grid.
  const perUnit = desktop ? 80 : 40; // particles per m² of face
  let total = 0;
  for (const b of buildings) {
    const perimeter = 2 * (b.w + b.d);
    total += Math.max(120, Math.floor(perimeter * b.h * perUnit));
  }

  const positions = new Float32Array(total * 3);
  const targets = new Float32Array(total * 3);
  const colors = new Float32Array(total * 3);
  const sizes = new Float32Array(total);
  const phases = new Float32Array(total);
  const tmp = new THREE.Color();

  let idx = 0;
  for (const b of buildings) {
    const perimeter = 2 * (b.w + b.d);
    const n = Math.max(120, Math.floor(perimeter * b.h * perUnit));
    const baseY = -2.4;
    const wallGrid = 0.11; // pixel spacing

    for (let i = 0; i < n; i++) {
      // choose one of 4 vertical faces weighted by width
      const rr = Math.random() * perimeter;
      let fx = 0;
      let fz = 0;
      let along = 0;
      let dir: 0 | 1 = 0; // 0 = x-axis face, 1 = z-axis face
      if (rr < b.w) { fx = -b.w / 2; fz = 0; along = Math.random() * b.d - b.d / 2; dir = 1; fz = along; fx = b.w / 2 * -1; }
      else if (rr < 2 * b.w) { fx = b.w / 2; along = Math.random() * b.d - b.d / 2; fz = along; dir = 1; }
      else if (rr < 2 * b.w + b.d) { fz = -b.d / 2; along = Math.random() * b.w - b.w / 2; fx = along; dir = 0; }
      else { fz = b.d / 2; along = Math.random() * b.w - b.w / 2; fx = along; dir = 0; }

      const yLocal = Math.random() * b.h;
      // Snap to window grid for pixel texture
      const snapX = Math.round(fx / wallGrid) * wallGrid;
      const snapZ = Math.round(fz / wallGrid) * wallGrid;
      const snapY = Math.round(yLocal / wallGrid) * wallGrid;

      const wx = b.x + snapX + (Math.random() - 0.5) * 0.02;
      const wy = baseY + snapY + (Math.random() - 0.5) * 0.02;
      const wz = b.z + snapZ + (Math.random() - 0.5) * 0.02;

      targets[idx * 3 + 0] = wx;
      targets[idx * 3 + 1] = wy;
      targets[idx * 3 + 2] = wz;

      // scatter start
      const rScat = 14 + Math.random() * 20;
      const aScat = Math.random() * Math.PI * 2;
      positions[idx * 3 + 0] = Math.cos(aScat) * rScat;
      positions[idx * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[idx * 3 + 2] = Math.sin(aScat) * rScat;

      // Colour: mostly deep lime; top ~20% of building brighter; occasional cyan/white sparks
      const heightFrac = yLocal / b.h;
      if (Math.random() < 0.03) {
        tmp.copy(CORE_WHITE);
      } else if (Math.random() < 0.02) {
        tmp.copy(CYAN_HINT).lerp(LIME, 0.4);
      } else if (heightFrac > 0.8 && Math.random() < 0.35) {
        tmp.copy(LIME).lerp(CORE_WHITE, 0.3);
      } else {
        tmp.copy(LIME_DEEP).lerp(LIME_MID, 0.2 + Math.random() * 0.7);
      }
      colors[idx * 3 + 0] = tmp.r;
      colors[idx * 3 + 1] = tmp.g;
      colors[idx * 3 + 2] = tmp.b;

      sizes[idx] = 0.014 + Math.random() * 0.028;
      phases[idx] = b.phase + (Math.random() - 0.5) * 0.08;

      idx++;
      // Suppress unused-var warnings for `dir`/`along` (branches use them)
      void dir; void along;
      if (idx >= total) break;
    }
    if (idx >= total) break;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geom.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  geom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  return { geom, buildings };
}

function generateGround(desktop: boolean) {
  const count = desktop ? 5200 : 1500;
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    // disc distribution around core
    const r = Math.sqrt(Math.random()) * 15;
    const a = Math.random() * Math.PI * 2;
    // bias to right/front (avoid pure symmetric)
    pos[i * 3 + 0] = Math.cos(a) * r;
    pos[i * 3 + 1] = -2.38 + Math.random() * 0.04;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.75 - 1;
    size[i] = 0.35 + Math.random() * 0.9;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  return g;
}

function generateAmbient(desktop: boolean) {
  const count = desktop ? 1300 : 420;
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 7 + Math.random() * 22;
    const a = -Math.PI * 0.75 + Math.random() * Math.PI * 1.5;
    pos[i * 3 + 0] = Math.cos(a) * r;
    pos[i * 3 + 1] = -1 + Math.random() * 9;
    pos[i * 3 + 2] = Math.sin(a) * r * 0.55 - 3;
    size[i] = 0.5 + Math.random() * 1.6;
    phase[i] = Math.random() * Math.PI * 2;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  return g;
}

function generateStreams(desktop: boolean, buildings: Building[]) {
  const streamCount = desktop ? 68 : 24;
  const positions = new Float32Array(streamCount * 2 * 3);
  const data: StreamDatum[] = [];
  for (let i = 0; i < streamCount; i++) {
    // Half of desktop streams shoot up from buildings; rest from random ground pts
    let bx: number;
    let bz: number;
    if (buildings.length > 0 && Math.random() < 0.55) {
      const b = buildings[Math.floor(Math.random() * buildings.length)];
      bx = b.x + (Math.random() - 0.5) * b.w * 0.6;
      bz = b.z + (Math.random() - 0.5) * b.d * 0.6;
    } else {
      const r = 3.5 + Math.random() * 9.5;
      const ang = -Math.PI * 0.55 + Math.random() * Math.PI * 1.1;
      bx = Math.cos(ang) * r;
      bz = Math.sin(ang) * r * 0.7;
    }
    const height = 1.6 + Math.random() * 5.5;
    data.push({ bx, bz, height, phase: Math.random() * 4, speed: 0.35 + Math.random() * 0.95 });
    positions[i * 6 + 0] = bx;
    positions[i * 6 + 1] = -2.4;
    positions[i * 6 + 2] = bz;
    positions[i * 6 + 3] = bx;
    positions[i * 6 + 4] = -2.4 + height;
    positions[i * 6 + 5] = bz;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return { geom: g, data, streamCount };
}

function makeGlowTexture(): THREE.Texture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, "rgba(230, 255, 184, 1)");
  grad.addColorStop(0.12, "rgba(157, 255, 63, 0.85)");
  grad.addColorStop(0.35, "rgba(80, 200, 60, 0.35)");
  grad.addColorStop(0.7, "rgba(30, 80, 30, 0.05)");
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

    // ─── SCENE / CAMERA / RENDERER ────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030603, 0.036);

    const camera = new THREE.PerspectiveCamera(
      44,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      240
    );
    camera.position.set(0, 6.5, 22);
    const camTarget = new THREE.Vector3(6.4, 2.6, 0);
    camera.lookAt(camTarget);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isDesktop ? 1.75 : 1.3));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // World group shifted to the right of frame
    const world = new THREE.Group();
    const worldOriginX = isDesktop ? 6.4 : 3.4;
    world.position.x = worldOriginX;
    scene.add(world);

    // ─── GROUND GRIDS ──────────────────────────────────────────────────────
    const gridOuter = new THREE.GridHelper(46, isDesktop ? 46 : 26, 0x3f931d, 0x11330a);
    (gridOuter.material as THREE.LineBasicMaterial).transparent = true;
    (gridOuter.material as THREE.LineBasicMaterial).opacity = 0.3;
    (gridOuter.material as THREE.LineBasicMaterial).depthWrite = false;
    gridOuter.position.y = -2.42;
    world.add(gridOuter);

    const gridInner = new THREE.GridHelper(16, isDesktop ? 32 : 18, 0x8ee02d, 0x1e5210);
    (gridInner.material as THREE.LineBasicMaterial).transparent = true;
    (gridInner.material as THREE.LineBasicMaterial).opacity = 0.32;
    (gridInner.material as THREE.LineBasicMaterial).depthWrite = false;
    gridInner.position.y = -2.4;
    world.add(gridInner);

    // ─── GROUND PIXEL FIELD ───────────────────────────────────────────────
    const groundGeom = generateGround(isDesktop);
    const groundMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: GROUND_VERT,
      fragmentShader: GROUND_FRAG,
    });
    world.add(new THREE.Points(groundGeom, groundMat));

    // ─── CITY BUILDINGS ───────────────────────────────────────────────────
    const { geom: cityGeom, buildings } = generateBuildings(isDesktop);
    const cityMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAssemble: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: CITY_VERT,
      fragmentShader: CITY_FRAG,
    });
    const cityPoints = new THREE.Points(cityGeom, cityMat);
    world.add(cityPoints);

    // ─── CENTRAL MONOLITH CORE ────────────────────────────────────────────
    const coreGeom = generateMonolith(isDesktop);
    const coreMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uAssemble: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
    });
    const corePoints = new THREE.Points(coreGeom, coreMat);
    world.add(corePoints);

    // ─── CENTRAL ENERGY GLOW SPRITE (behind core) ─────────────────────────
    const glowTex = makeGlowTexture();
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
      color: 0xffffff,
    });
    const glow = new THREE.Sprite(glowMat);
    glow.scale.set(isDesktop ? 11 : 7.5, isDesktop ? 11 : 7.5, 1);
    glow.position.set(0, 0.4, -0.6);
    world.add(glow);

    // A second smaller, hotter glow at the base of the core
    const glowInnerMat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
      color: 0xdcffb0,
    });
    const glowInner = new THREE.Sprite(glowInnerMat);
    glowInner.scale.set(isDesktop ? 5 : 3.5, isDesktop ? 5 : 3.5, 1);
    glowInner.position.set(0, -0.6, 0.6);
    world.add(glowInner);

    // ─── VERTICAL DATA STREAMS ────────────────────────────────────────────
    const { geom: streamGeom, data: streamData, streamCount } = generateStreams(isDesktop, buildings);
    const streamMat = new THREE.LineBasicMaterial({
      color: 0xbfff6e,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const streams = new THREE.LineSegments(streamGeom, streamMat);
    world.add(streams);

    // ─── AMBIENT PARTICLES ────────────────────────────────────────────────
    const ambGeom = generateAmbient(isDesktop);
    const ambMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: AMB_VERT,
      fragmentShader: AMB_FRAG,
    });
    world.add(new THREE.Points(ambGeom, ambMat));

    // ─── POINTER ──────────────────────────────────────────────────────────
    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    if (!isCoarse) window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ─── RESIZE ───────────────────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // ─── LOOP ─────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    let running = false;
    let assemble = 0;

    const ndc = new THREE.Vector3();
    const worldMouse = new THREE.Vector3();

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      assemble = Math.min(1, assemble + (reduceMotion ? 0.02 : 0.0055));
      const a = easeOutCubic(assemble);

      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.05;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.05;

      // Camera parallax
      camera.position.x = smoothPointer.x * 1.8;
      camera.position.y = 6.5 + smoothPointer.y * 0.9;
      camTarget.set(
        worldOriginX + smoothPointer.x * 0.6,
        2.6 + smoothPointer.y * 0.5,
        0
      );
      camera.lookAt(camTarget);

      world.position.x = worldOriginX + smoothPointer.x * 0.28;
      world.position.y = smoothPointer.y * 0.2;
      world.rotation.y = smoothPointer.x * 0.075 + Math.sin(t * 0.07) * 0.014;

      // Project cursor onto z=0 plane in local world space
      ndc.set(smoothPointer.x, smoothPointer.y, 0.5).unproject(camera);
      const dir = ndc.sub(camera.position).normalize();
      if (Math.abs(dir.z) > 1e-4) {
        const dist = -camera.position.z / dir.z;
        worldMouse.copy(camera.position).addScaledVector(dir, dist);
        const localMx = worldMouse.x - world.position.x;
        const localMy = worldMouse.y - world.position.y;
        coreMat.uniforms.uMouse.value.set(localMx, localMy, 0);
        cityMat.uniforms.uMouse.value.set(localMx, localMy, 0);
      }

      coreMat.uniforms.uTime.value = t;
      coreMat.uniforms.uAssemble.value = a;
      cityMat.uniforms.uTime.value = t;
      cityMat.uniforms.uAssemble.value = a;
      groundMat.uniforms.uTime.value = t;
      ambMat.uniforms.uTime.value = t;

      // Central glow pulse
      const gp = 0.85 + Math.sin(t * 1.4) * 0.08;
      glow.material.opacity = gp * 0.85;
      glowInner.material.opacity = 0.9 + Math.sin(t * 2.1) * 0.1;
      glow.scale.x = glow.scale.y = (isDesktop ? 11 : 7.5) * (0.98 + Math.sin(t * 1.1) * 0.04);

      // Data-stream rising pulses
      const positions = streamGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < streamCount; i++) {
        const s = streamData[i];
        const cyc = ((t * s.speed + s.phase) % 2) - 0.35;
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
      cityGeom.dispose();
      cityMat.dispose();
      groundGeom.dispose();
      groundMat.dispose();
      ambGeom.dispose();
      ambMat.dispose();
      streamGeom.dispose();
      streamMat.dispose();
      gridOuter.geometry.dispose();
      (gridOuter.material as THREE.Material).dispose();
      gridInner.geometry.dispose();
      (gridInner.material as THREE.Material).dispose();
      glowTex.dispose();
      glowMat.dispose();
      glowInnerMat.dispose();
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
