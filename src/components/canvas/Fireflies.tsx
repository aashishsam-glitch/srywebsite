'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FirefliesProps {
  count?: number;
  sceneId: number;
}

export const Fireflies: React.FC<FirefliesProps> = ({ count = 65, sceneId }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions, velocities, and natural phase offsets
  const [positions, phases, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.4 + Math.random() * 0.8;
    }

    return [pos, ph, sp];
  }, [count]);

  const pointerVec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const t = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const array = positionAttr.array as Float32Array;

    // Convert normalized pointer to approximate 3D plane
    pointerVec.current.set(state.pointer.x * 5, state.pointer.y * 3.5, 0);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const speed = speeds[i];
      const phase = phases[i];

      // Gentle natural hovering
      array[idx] += Math.sin(t * speed + phase) * 0.005;
      array[idx + 1] += Math.cos(t * speed + phase) * 0.005;
      array[idx + 2] += Math.sin(t * 0.5 + phase) * 0.003;

      // Cursor interaction: fireflies are gently attracted to pointer when in floating garden, or avoid if too close
      if (sceneId === 1 || sceneId === 0) {
        const dx = pointerVec.current.x - array[idx];
        const dy = pointerVec.current.y - array[idx + 1];
        const distSq = dx * dx + dy * dy;

        if (distSq < 9 && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          // Soft playful repulsion if within 1.2 units, attraction if within 3 units
          const force = (dist - 1.2) * 0.003;
          array[idx] += (dx / dist) * force;
          array[idx + 1] += (dy / dist) * force;
        }
      }

      // Boundary loop back
      if (array[idx] > 7.5) array[idx] = -7.5;
      if (array[idx] < -7.5) array[idx] = 7.5;
      if (array[idx + 1] > 5) array[idx + 1] = -5;
      if (array[idx + 1] < -5) array[idx + 1] = 5;
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#F8E3C0"
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
