'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createHeartGeometry } from './HeartGeometry';

interface MagneticHeartProps {
  sceneId: number;
  scale?: number;
  isDrifting?: boolean;
}

export const MagneticHeart: React.FC<MagneticHeartProps> = ({
  sceneId,
  scale = 1.2,
  isDrifting = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  const geometry = useMemo(() => {
    return createHeartGeometry(0.32, 1.0);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Scene-specific transformations and behaviors
    if (sceneId === 0) {
      // Scene 1: Floating in center, magnetic turn to pointer
      const targetRotY = state.pointer.x * 0.5 + Math.sin(t * 0.6) * 0.2;
      const targetRotX = -state.pointer.y * 0.35 + Math.cos(t * 0.5) * 0.1;
      const targetPosY = Math.sin(t * 1.2) * 0.15;

      meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 3, delta);
      meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 3, delta);
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPosY, 3, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, 0, 2, delta);
      meshRef.current.scale.setScalar(scale);
    } else if (sceneId === 1) {
      // Scene 2: Positioned slightly higher and further back, gentle rotation
      const targetPosY = 1.2 + Math.sin(t * 0.8) * 0.1;
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPosY, 2, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, -2.5, 2, delta);
      meshRef.current.scale.setScalar(scale * 0.85);
    } else if (sceneId === 2) {
      // Scene 3: Dimmed and placed above the constellation
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, 2.8, 2, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, -4, 2, delta);
      meshRef.current.scale.setScalar(scale * 0.5);
    } else if (sceneId === 3) {
      // Scene 4: Soft background heart beating imperceptibly
      // Slow, intimate heartbeat: lub-dub pulse
      const pulse = Math.pow(Math.sin(t * 1.8), 6) * 0.045;
      meshRef.current.position.set(0, 0.4, -3.5);
      meshRef.current.scale.setScalar(scale * 0.75 + pulse);
      meshRef.current.rotation.y += delta * 0.1;
    } else if (sceneId === 4) {
      // Scene 5: Central anchor for orbiting petals
      meshRef.current.position.set(0, 0, -0.5);
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.scale.setScalar(scale * 0.7);
    } else if (sceneId === 5) {
      // Scene 6: Calm final glowing heart, fades away gracefully if isDrifting
      const targetScale = isDrifting ? 0.001 : scale * 0.9;
      meshRef.current.position.set(0, 0.3, -0.5);
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 1.5);
    }

    if (glowRef.current) {
      glowRef.current.intensity = 1.5 + Math.sin(t * 2) * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#F9D4E4"
          emissive="#D78DAC"
          emissiveIntensity={0.22}
          roughness={0.16}
          metalness={0.08}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
          transmission={0.4}
          ior={1.45}
          thickness={1.5}
          specularIntensity={1.0}
        />
        <pointLight
          ref={glowRef}
          color="#F3A5C7"
          intensity={1.8}
          distance={4}
          decay={2}
        />
      </mesh>
    </group>
  );
};
