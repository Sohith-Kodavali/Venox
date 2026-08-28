"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Text3D } from "@react-three/drei";
import * as THREE from "three";

const LIME = "#9dff3f";
const FONT = "/fonts/helvetiker_bold.typeface.json";
const SLOTS = [-5.6, -2.8, 0, 2.8, 5.6];
const CHARS = ["V", "E", "X", "O", "N"];
const FLOOR_Y = -1.7;

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(p: number, a: number, b: number) {
  const t = Math.min(Math.max((p - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

function Letter({ char, index, progress }: { char: string; index: number; progress: React.MutableRefObject<number> }) {
  const outer = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const reflection = useRef<THREE.Mesh>(null);
  const isV = index === 0;

  useLayoutEffect(() => {
    const g = mesh.current?.geometry;
    if (g) {
      g.computeBoundingBox();
      g.center();
      if (reflection.current) reflection.current.geometry = g.clone();
    }
  }, [char]);

  useFrame(({ clock }, delta) => {
    const g = outer.current;
    if (!g) return;
    const p = progress.current;
    const t = clock.getElapsedTime();

    let targetX: number;
    let appear: number;
    if (isV) {
      targetX = THREE.MathUtils.lerp(0, SLOTS[0], smoothstep(p, 0.1, 0.28));
      appear = 1;
    } else {
      const start = 0.22 + (index - 1) * 0.08;
      appear = smoothstep(p, start, start + 0.18);
      targetX = THREE.MathUtils.lerp(16 + index * 2.2, SLOTS[index], appear);
    }
    const targetZ = isV ? 0 : THREE.MathUtils.lerp(-11, 0, appear);

    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 6, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 6, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, Math.sin(t * 1.1 + index * 0.9) * 0.07, 6, delta);

    const settle = smoothstep(p, 0.62, 0.82);
    const idleSpin = isV ? t * 0.5 * (1 - smoothstep(p, 0.08, 0.22)) : 0;
    g.rotation.y = idleSpin + (1 - appear) * 1.3 + Math.sin(t * 0.5 + index) * 0.035 * (1 - settle);
    g.rotation.x = Math.sin(t * 0.4 + index * 1.3) * 0.028 * (1 - settle);
    g.scale.setScalar(1 + settle * 0.02 + Math.sin(t * 1.4 + index) * 0.005);

    if (reflection.current) {
      reflection.current.position.y = 2 * FLOOR_Y - g.position.y;
      reflection.current.rotation.y = g.rotation.y;
      reflection.current.rotation.z = -g.rotation.z;
    }
  });

  return (
    <group ref={outer}>
      <Text3D
        ref={mesh}
        font={FONT}
        size={1.7}
        height={1.05}
        bevelEnabled
        bevelThickness={0.07}
        bevelSize={0.045}
        bevelSegments={4}
        curveSegments={6}
      >
        {char}
        <meshStandardMaterial color="#1a2b0d" emissive={LIME} emissiveIntensity={0.65} metalness={0.75} roughness={0.22} />
      </Text3D>
      <mesh ref={reflection} position={[0, 2 * FLOOR_Y, 0]} scale={[1, -1, 1]}>
        <meshBasicMaterial color={LIME} transparent opacity={0.09} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Particles({ count, spread, z, size, opacity }: { count: number; spread: number; z: number; size: number; opacity: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let k = 0; k < count; k++) {
      const seed = k * 2.1 + z * 7.3;
      arr[k * 3] = (rand(seed + 1) - 0.5) * spread;
      arr[k * 3 + 1] = (rand(seed + 2) - 0.5) * spread * 0.55;
      arr[k * 3 + 2] = z + (rand(seed + 3) - 0.5) * 4;
    }
    return arr;
  }, [count, spread, z]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={LIME}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  const rig = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const rimL = useRef<THREE.PointLight>(null);
  const rimR = useRef<THREE.PointLight>(null);

  useFrame(({ camera, pointer, clock }, delta) => {
    const p = progress.current;
    const settle = smoothstep(p, 0.62, 0.82);
    const t = clock.getElapsedTime();

    if (rig.current) {
      rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, pointer.x * 0.24 * (1 - settle * 0.75), 3, delta);
      rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, -pointer.y * 0.13 * (1 - settle * 0.75), 3, delta);
    }

    camera.position.z = THREE.MathUtils.damp(camera.position.z, THREE.MathUtils.lerp(15.5, 12.8, settle), 3, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, Math.sin(t * 0.25) * 0.25, 3, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.15 + Math.sin(t * 0.3) * 0.15, 3, delta);
    camera.lookAt(0, -0.1, 0);

    if (glow.current) glow.current.intensity = 45 + settle * 110 + Math.sin(t * 2) * 7;
    if (rimL.current) rimL.current.intensity = 20 + settle * 35;
    if (rimR.current) rimR.current.intensity = 14 + settle * 25;
  });

  return (
    <>
      <fog attach="fog" args={["#040603", 17, 36]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 6]} intensity={0.55} color="#d8f0be" />
      <pointLight ref={glow} position={[0, 0.5, 6.5]} color={LIME} intensity={45} distance={28} decay={2} />
      <pointLight ref={rimL} position={[-9, 4, -5]} color={LIME} intensity={20} distance={22} decay={2} />
      <pointLight ref={rimR} position={[9, -2, -7]} color="#4d7c0f" intensity={14} distance={22} decay={2} />
      <Grid
        args={[46, 46]}
        cellSize={0.7}
        cellThickness={0.5}
        cellColor="#18290c"
        sectionSize={3.5}
        sectionThickness={1}
        sectionColor="#274512"
        fadeDistance={32}
        fadeStrength={1.7}
        infiniteGrid
        position={[0, FLOOR_Y - 0.01, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.01, 0]}>
        <circleGeometry args={[9, 48]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.05} depthWrite={false} />
      </mesh>
      <group ref={rig}>
        <Suspense fallback={null}>
          {CHARS.map((c, i) => (
            <Letter key={c} char={c} index={i} progress={progress} />
          ))}
        </Suspense>
        <Particles count={160} spread={24} z={-6} size={0.05} opacity={0.28} />
        <Particles count={120} spread={16} z={-1} size={0.035} opacity={0.4} />
        <Particles count={90} spread={12} z={4} size={0.025} opacity={0.5} />
      </group>
    </>
  );
}

export default function VenoxScene({ progress }: { progress: React.MutableRefObject<number> }) {
  return (
    <Canvas camera={{ position: [0, 0.15, 15.5], fov: 32 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <Scene progress={progress} />
      </Suspense>
    </Canvas>
  );
}
