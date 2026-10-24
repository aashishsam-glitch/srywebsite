'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { soundEngine } from '@/lib/audioSynth';

interface FinalParticleDriftProps {
  isDrifting: boolean;
  onDriftComplete?: () => void;
}

export const FinalParticleDrift: React.FC<FinalParticleDriftProps> = ({
  isDrifting,
  onDriftComplete,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 180;
  const progressRef = useRef(0);

  // Generate origins (heart perimeter) and final starry sky destinations
  const [positions, targets, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const tar = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color('#F3A5C7'),
      new THREE.Color('#B7A5F7'),
      new THREE.Color('#FFF3E8'),
      new THREE.Color('#E8CDA9'),
    ];

    for (let i = 0; i < count; i++) {
      // Start near center heart
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.4 + 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      // Some form a heart constellation shape up high, others disperse into the galaxy
      if (i < 45) {
        const t = (i / 45) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3) * 0.12;
        const hy = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.12 + 1.8;
        tar[i * 3] = hx;
        tar[i * 3 + 1] = hy;
        tar[i * 3 + 2] = -2 + (Math.random() - 0.5) * 0.3;
      } else {
        tar[i * 3] = (Math.random() - 0.5) * 16;
        tar[i * 3 + 1] = 1.0 + Math.random() * 7;
        tar[i * 3 + 2] = -1 - Math.random() * 8;
      }

      const c = palette[i % palette.length];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      sz[i] = 0.12 + Math.random() * 0.16;
    }

    return [pos, tar, col, sz];
  }, [count]);

  useEffect(() => {
    if (isDrifting) {
      progressRef.current = 0;
      soundEngine.playStarSparkle();
    }
  }, [isDrifting]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !isDrifting) return;

    progressRef.current = Math.min(progressRef.current + delta * 0.32, 1);
    const p = progressRef.current;

    const positionAttr = pointsRef.current.geometry.attributes.position;
    const array = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - p, 3);

      array[idx] = positions[idx] + (targets[idx] - positions[idx]) * ease;
      array[idx + 1] = positions[idx + 1] + (targets[idx + 1] - positions[idx + 1]) * ease;
      array[idx + 2] = positions[idx + 2] + (targets[idx + 2] - positions[idx + 2]) * ease;
    }

    positionAttr.needsUpdate = true;

    if (p >= 0.98 && onDriftComplete) {
      onDriftComplete();
    }
  });

  if (!isDrifting) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
