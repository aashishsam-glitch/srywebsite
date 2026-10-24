'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createHeartGeometry } from './HeartGeometry';

// Procedural Bioluminescent Flower
function GlowingFlower({ position, color, stemColor = '#243a3d' }: { position: [number, number, number]; color: string; stemColor?: string }) {
  const flowerRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!flowerRef.current) return;
    const t = state.clock.getElapsedTime();
    // Soft organic sway
    flowerRef.current.rotation.z = Math.sin(t * 1.2 + position[0]) * 0.08;
    flowerRef.current.rotation.x = Math.cos(t * 0.9 + position[2]) * 0.06;
  });

  return (
    <group ref={flowerRef} position={position}>
      {/* Delicate Curved Stem */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.018, 0.025, 0.9, 8]} />
        <meshStandardMaterial color={stemColor} roughness={0.7} />
      </mesh>

      {/* Center glowing stamen */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#FFF8E0"
          emissive="#FFE399"
          emissiveIntensity={1.4}
          roughness={0.2}
        />
        <pointLight color={color} intensity={0.6} distance={1.8} />
      </mesh>

      {/* 5 Petals arranged radially */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i} rotation={[0.4, 0, angle]}>
            <mesh position={[0, 0.16, 0]}>
              <coneGeometry args={[0.09, 0.28, 6]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.3}
                roughness={0.3}
                transparent
                opacity={0.85}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// Mini floating crystal hearts
function MiniFloatingHeart({
  position,
  scale = 0.22,
  speed = 1,
  color = '#F3A5C7',
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geom = useMemo(() => createHeartGeometry(0.2, scale), [scale]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y += delta * 0.4 * speed;
    meshRef.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geom}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        roughness={0.2}
        transmission={0.5}
        thickness={0.8}
        clearcoat={0.8}
      />
    </mesh>
  );
}

export const FloatingGarden3D: React.FC<{ visible: boolean }> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = visible ? 1 : 0.001;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Floating Island Base / Glassy Reflective Pond */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4.2, 3.2, 0.45, 32]} />
        <meshPhysicalMaterial
          color="#0d112b"
          roughness={0.15}
          metalness={0.3}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
          transmission={0.3}
        />
      </mesh>

      {/* Bioluminescent Flowers around the garden perimeter */}
      <GlowingFlower position={[-1.8, -0.9, 0.8]} color="#F3A5C7" />
      <GlowingFlower position={[-2.2, -0.9, -0.5]} color="#B7A5F7" />
      <GlowingFlower position={[1.8, -0.9, 0.6]} color="#E8CDA9" />
      <GlowingFlower position={[2.1, -0.9, -0.7]} color="#F3A5C7" />
      <GlowingFlower position={[-0.8, -0.9, 1.9]} color="#FFF3E8" />
      <GlowingFlower position={[0.9, -0.9, 1.8]} color="#B7A5F7" />

      {/* Gentle floating companion hearts */}
      <MiniFloatingHeart position={[-2.5, 0.3, -1]} scale={0.2} speed={0.9} color="#B7A5F7" />
      <MiniFloatingHeart position={[2.4, 0.6, -1.2]} scale={0.18} speed={1.2} color="#F3A5C7" />
      <MiniFloatingHeart position={[1.5, 1.3, -2.5]} scale={0.15} speed={0.7} color="#E8CDA9" />

      {/* Distant floating crystal orbs / miniature planets */}
      <mesh position={[-4.5, 1.8, -6]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshPhysicalMaterial
          color="#1e1840"
          emissive="#3a256d"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.2}
          clearcoat={0.9}
        />
      </mesh>
      <mesh position={[5.2, 2.2, -7]}>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshPhysicalMaterial
          color="#162243"
          emissive="#243870"
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.2}
          clearcoat={0.9}
        />
      </mesh>
    </group>
  );
};
