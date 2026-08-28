"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

const LIME = "#9dff3f";

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
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
      wire.current.rotation.y = t * 0.3;
      wire.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.45;
      ring.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.z = -t * 0.3;
      ring2.current.rotation.x = Math.PI / 1.9 + Math.cos(t * 0.24) * 0.12;
    }
    if (light.current) light.current.intensity = 32 + Math.sin(t * 2.2) * 9;
    if (group.current) group.current.position.y = Math.sin(t * 1.1) * 0.12;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color="#16240c" emissive={LIME} emissiveIntensity={0.9} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh ref={wire} scale={1.22}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={LIME} wireframe transparent opacity={0.4} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.1, 0.012, 8, 96]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.6, 0.008, 8, 96]} />
        <meshBasicMaterial color={LIME} transparent opacity={0.28} />
      </mesh>
      <pointLight ref={light} color={LIME} intensity={32} distance={12} decay={2} />
    </group>
  );
}

function Particles({ count = 150 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let k = 0; k < count; k++) {
      arr[k * 3] = (rand(k * 2.1 + 1) - 0.5) * 15;
      arr[k * 3 + 1] = rand(k * 2.1 + 2) * 5 + 0.2;
      arr[k * 3 + 2] = (rand(k * 2.1 + 3) - 0.5) * 15;
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
      group.current.rotation.y = clock.getElapsedTime() * 0.05 + pointer.x * 0.14;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.07, 0.04);
    }
  });

  return <group ref={group}>{children}</group>;
}

function CameraIntro() {
  const target = new THREE.Vector3(2.6, 0.6, 6.4);
  const start = new THREE.Vector3(2.6, 3, 11);

  useFrame(({ camera, clock }) => {
    const t = Math.min(clock.getElapsedTime() / 1.8, 1);
    const e = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(start, target, e);
    camera.lookAt(2.6, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [2.6, 3, 11], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#050704", 8, 18]} />
      <CameraIntro />
      <ambientLight intensity={0.2} />
      <directionalLight position={[6, 10, 4]} intensity={0.4} color="#cfe8b0" />
      <Grid
        args={[30, 30]}
        cellSize={0.6}
        cellThickness={0.5}
        cellColor="#1d3110"
        sectionSize={3}
        sectionThickness={1}
        sectionColor="#2c4d14"
        fadeDistance={18}
        fadeStrength={1.8}
        position={[2.6, -1.4, 0]}
      />
      <Rig>
        <group position={[2.6, 0.4, 0]}>
          <Core />
          <Particles />
        </group>
      </Rig>
    </Canvas>
  );
}
