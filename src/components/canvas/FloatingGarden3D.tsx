'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createHeartGeometry } from './HeartGeometry';

// Procedural Bioluminescent Flower with smooth organic curves
function GlowingFlower({
  position,
  color,
  stemColor = '#1d3133',
}: {
  position: [number, number, number];
  color: string;
  stemColor?: string;
}) {
  const flowerRef = useRef<THREE.Group>(null);
  const stamenLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!flowerRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle natural botanical sway
    flowerRef.current.rotation.z = Math.sin(t * 1.1 + position[0]) * 0.06;
    flowerRef.current.rotation.x = Math.cos(t * 0.85 + position[2]) * 0.05;

    if (stamenLightRef.current) {
      stamenLightRef.current.intensity = 0.8 + Math.sin(t * 2.0 + position[0]) * 0.25;
    }
  });

  return (
    <group ref={flowerRef} position={position}>
      {/* Smooth Cylindrical Curved Stem */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.016, 0.024, 0.9, 24]} />
        <meshStandardMaterial color={stemColor} roughness={0.6} />
      </mesh>

      {/* Luminous Warm Stamen Core */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial
          color="#FFF8E4"
          emissive="#FFEAA8"
          emissiveIntensity={1.8}
          roughness={0.15}
        />
        <pointLight ref={stamenLightRef} color={color} intensity={0.9} distance={2.4} />
      </mesh>

      {/* 5 Silky Petals arranged radially */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        return (
          <group key={i} rotation={[0.42, 0, angle]}>
            <mesh position={[0, 0.16, 0]}>
              <coneGeometry args={[0.09, 0.28, 24]} />
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.35}
                roughness={0.2}
                transmission={0.4}
                thickness={0.5}
                clearcoat={0.8}
                transparent
                opacity={0.9}
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
    meshRef.current.rotation.y += delta * 0.35 * speed;
    meshRef.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geom}>
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        roughness={0.1}
        transmission={0.65}
        ior={1.45}
        thickness={1.0}
        clearcoat={1.0}
        iridescence={0.3}
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
      {/* Floating Island Base / Glassy Reflective Pond with smooth 64 segments */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4.2, 3.2, 0.45, 64]} />
        <meshPhysicalMaterial
          color="#0b0f26"
          roughness={0.12}
          metalness={0.25}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          reflectivity={0.95}
          transmission={0.35}
        />
      </mesh>

      {/* Bioluminescent Flowers around the garden perimeter */}
      <GlowingFlower position={[-1.8, -0.9, 0.8]} color="#F3A5C7" />
      <GlowingFlower position={[-2.2, -0.9, -0.5]} color="#B7A5F7" />
      <GlowingFlower position={[1.8, -0.9, 0.6]} color="#E8CDA9" />
      <GlowingFlower position={[2.1, -0.9, -0.7]} color="#F3A5C7" />
      <GlowingFlower position={[-0.8, -0.9, 1.9]} color="#FFF3E8" />
      <GlowingFlower position={[0.9, -0.9, 1.8]} color="#B7A5F7" />

      {/* Gentle floating companion crystal hearts */}
      <MiniFloatingHeart position={[-2.5, 0.3, -1]} scale={0.22} speed={0.9} color="#B7A5F7" />
      <MiniFloatingHeart position={[2.4, 0.6, -1.2]} scale={0.2} speed={1.2} color="#F3A5C7" />
      <MiniFloatingHeart position={[1.5, 1.3, -2.5]} scale={0.16} speed={0.7} color="#E8CDA9" />

      {/* Distant floating crystal orbs / miniature planets with high poly smoothness */}
      <mesh position={[-4.5, 1.8, -6]}>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshPhysicalMaterial
          color="#1b153b"
          emissive="#352166"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.15}
          clearcoat={1.0}
        />
      </mesh>
      <mesh position={[5.2, 2.2, -7]}>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshPhysicalMaterial
          color="#131e3d"
          emissive="#203366"
          emissiveIntensity={0.55}
          roughness={0.2}
          metalness={0.15}
          clearcoat={1.0}
        />
      </mesh>
    </group>
  );
};
