"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Instance, Instances } from "@react-three/drei";
import * as THREE from "three";

const GRID = 23;
const CELL = 0.6;
const LIME = "#9dff3f";

function fract(n: number) {
  return n - Math.floor(n);
}

function hash(i: number, j: number, salt: number) {
  return fract(Math.sin(i * 127.1 + j * 311.7 + salt * 74.7) * 43758.5453);
}

function useCity() {
  return useMemo(() => {
    const blocks: { x: number; z: number; h: number; w: number; lit: boolean }[] = [];
    const half = Math.floor(GRID / 2);
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const x = (i - half) * CELL;
        const z = (j - half) * CELL;
        const dist = Math.sqrt(x * x + z * z);
        if (dist < 1.7) continue;
        const r = hash(i, j, 1);
        const falloff = Math.max(0, 1 - dist / (half * CELL * 1.05));
        const h = 0.18 + r * (0.5 + falloff * 2.6);
        if (h < 0.3 && r < 0.35) continue;
        blocks.push({ x, z, h, w: 0.4 + hash(i, j, 2) * 0.15, lit: hash(i, j, 6) > 0.9 });
      }
    }
    return blocks;
  }, []);
}

function CityBlocks() {
  const blocks = useCity();
  const dark = blocks.filter((b) => !b.lit);
  const lit = blocks.filter((b) => b.lit);

  return (
    <group>
      <Instances limit={dark.length}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0d130c" roughness={0.8} metalness={0.3} />
        {dark.map((b, k) => (
          <Instance key={k} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.w]} />
        ))}
      </Instances>
      <Instances limit={Math.max(lit.length, 1)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#16240c" emissive={LIME} emissiveIntensity={0.55} roughness={0.6} metalness={0.2} />
        {lit.map((b, k) => (
          <Instance key={k} position={[b.x, b.h / 2, b.z]} scale={[b.w, b.h, b.w]} />
        ))}
      </Instances>
    </group>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);
  const wire = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wire.current) {
      wire.current.rotation.y = t * 0.35;
      wire.current.rotation.x = Math.sin(t * 0.4) * 0.18;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.5;
      ring.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.32;
      ring2.current.rotation.x = Math.PI / 1.9 + Math.cos(t * 0.24) * 0.12;
    }
    if (light.current) light.current.intensity = 30 + Math.sin(t * 2.2) * 9;
    if (group.current) group.current.position.y = 1.25 + Math.sin(t * 1.1) * 0.09;
  });

  return (
    <group ref={group} position={[0, 1.25, 0]}>
      <mesh>
        <boxGeometry args={[1.55, 1.55, 1.55]} />
        <meshStandardMaterial color="#1a2b0d" emissive={LIME} emissiveIntensity={1} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh ref={wire} scale={1.3}>
        <boxGeometry args={[1.55, 1.55, 1.55]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.32} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.3, 0.012, 8, 96]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.85, 0.008, 8, 96]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.28} />
      </mesh>
      <pointLight ref={light} color={LIME} intensity={30} distance={12} decay={2} />
    </group>
  );
}

function Beams() {
  const beams = useMemo(() => {
    const list: { x: number; z: number; h: number }[] = [];
    for (let k = 0; k < 18; k++) {
      const i = Math.floor(hash(k, 7, 3) * GRID) - Math.floor(GRID / 2);
      const j = Math.floor(hash(k, 13, 4) * GRID) - Math.floor(GRID / 2);
      const x = i * CELL;
      const z = j * CELL;
      if (Math.sqrt(x * x + z * z) < 2.1) continue;
      list.push({ x, z, h: 1.8 + hash(k, 3, 5) * 3.6 });
    }
    return list;
  }, []);

  return (
    <Instances limit={beams.length}>
      <boxGeometry args={[0.035, 1, 0.035]} />
      <meshBasicMaterial color={LIME} transparent opacity={0.38} blending={THREE.AdditiveBlending} depthWrite={false} />
      {beams.map((b, k) => (
        <Instance key={k} position={[b.x, b.h / 2 + 0.1, b.z]} scale={[1, b.h, 1]} />
      ))}
    </Instances>
  );
}

function Particles({ count = 320 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let k = 0; k < count; k++) {
      arr[k * 3] = (Math.random() - 0.5) * 17;
      arr[k * 3 + 1] = Math.random() * 6 + 0.2;
      arr[k * 3 + 2] = (Math.random() - 0.5) * 17;
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.4) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={LIME}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ pointer, clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.038 + pointer.x * 0.12;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.06, 0.04);
    }
  });

  return <group ref={group}>{children}</group>;
}

function CameraIntro() {
  const target = new THREE.Vector3(10.5, 7.5, 10.5);
  const start = new THREE.Vector3(18, 14, 18);

  useFrame(({ camera, clock }) => {
    const t = Math.min(clock.getElapsedTime() / 2.4, 1);
    const e = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(start, target, e);
    camera.lookAt(0, 0.9, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [18, 14, 18], fov: 30 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#050704", 11, 25]} />
      <CameraIntro />
      <ambientLight intensity={0.18} />
      <directionalLight position={[6, 10, 4]} intensity={0.35} color="#cfe8b0" />
      <Grid
        args={[42, 42]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#1d3110"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#2c4d14"
        fadeDistance={26}
        fadeStrength={1.6}
        infiniteGrid
        position={[2.6, -0.01, 0]}
      />
      <Rig>
        <group position={[2.6, -0.3, 0]}>
          <CityBlocks />
          <Core />
          <Beams />
          <Particles />
        </group>
      </Rig>
    </Canvas>
  );
}
