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
  scale = 1.25,
  isDrifting = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    return createHeartGeometry(0.3, 1.0);
  }, []);

  const innerCoreGeometry = useMemo(() => {
    return createHeartGeometry(0.18, 0.65);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Scene-specific transformations and smooth damping
    if (sceneId === 0) {
      // Scene 1: Floating in center, magnetic turn to pointer
      const targetRotY = state.pointer.x * 0.55 + Math.sin(t * 0.5) * 0.18;
      const targetRotX = -state.pointer.y * 0.35 + Math.cos(t * 0.45) * 0.1;
      const targetPosY = Math.sin(t * 1.2) * 0.14;

      meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 3.5, delta);
      meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 3.5, delta);
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPosY, 3.5, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, 0, 2.5, delta);
      meshRef.current.scale.setScalar(scale);
    } else if (sceneId === 1) {
      // Scene 2: Floating above garden with gentle ambient rotation
      const targetPosY = 1.1 + Math.sin(t * 0.8) * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetPosY, 2.5, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, -2.2, 2.5, delta);
      meshRef.current.scale.setScalar(scale * 0.88);
    } else if (sceneId === 2) {
      // Scene 3: Dimmed and placed above constellation
      meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, 2.7, 2.5, delta);
      meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, -3.8, 2.5, delta);
      meshRef.current.scale.setScalar(scale * 0.52);
    } else if (sceneId === 3) {
      // Scene 4: Soft background heart with delicate organic heartbeat (lub-dub)
      const pulseCycle = Math.sin(t * 2.2);
      const pulse = Math.pow(Math.max(0, pulseCycle), 8) * 0.055;
      meshRef.current.position.set(0, 0.35, -3.2);
      meshRef.current.scale.setScalar(scale * 0.78 + pulse);
      meshRef.current.rotation.y += delta * 0.12;
    } else if (sceneId === 4) {
      // Scene 5: Central anchor for orbiting petals
      meshRef.current.position.set(0, 0, -0.4);
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.scale.setScalar(scale * 0.72);
    } else if (sceneId === 5) {
      // Scene 6: Calm final glowing heart, fades away gracefully if isDrifting
      const targetScale = isDrifting ? 0.001 : scale * 0.92;
      meshRef.current.position.set(0, 0.3, -0.4);
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 1.8);
    }

    if (glowRef.current) {
      glowRef.current.intensity = 1.6 + Math.sin(t * 1.8) * 0.35;
    }

    if (coreRef.current) {
      const coreScale = 0.65 + Math.sin(t * 2.5) * 0.03;
      coreRef.current.scale.setScalar(coreScale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
        {/* Exterior Silky-Smooth Frosted Crystal Material */}
        <meshPhysicalMaterial
          color="#FCE7F1"
          emissive="#D78DAC"
          emissiveIntensity={0.16}
          roughness={0.08}
          metalness={0.03}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          transmission={0.82}
          ior={1.52}
          thickness={2.4}
          attenuationColor="#F3A5C7"
          attenuationDistance={1.6}
          iridescence={0.45}
          iridescenceIOR={1.33}
          specularIntensity={1.0}
        />

        {/* Soft Luminous Inner Core Heart */}
        <mesh ref={coreRef} geometry={innerCoreGeometry}>
          <meshBasicMaterial
            color="#FFF2E2"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <pointLight
          ref={glowRef}
          color="#F3A5C7"
          intensity={1.8}
          distance={4.5}
          decay={2}
        />
      </mesh>
    </group>
  );
};
