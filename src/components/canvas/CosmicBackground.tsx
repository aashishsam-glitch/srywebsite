'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getStarSpriteTexture } from './StarTextures';

export const CosmicBackground: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const brightStarsRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Points>(null);

  const starTexture = useMemo(() => {
    return getStarSpriteTexture();
  }, []);

  // Multi-magnitude background stars with realistic astronomical colors & twinkle phases
  const [starPositions, starColors, starSizes, starPhases, starSpeeds] = useMemo(() => {
    const count = 480;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);

    // Astronomical star spectral classes (O, B, A, F, G, K, M)
    const spectralColors = [
      new THREE.Color('#FFFFFF'), // Pure stellar white
      new THREE.Color('#FFF4EA'), // Warm white / Sun-like
      new THREE.Color('#F6D9E7'), // Soft rose starlight
      new THREE.Color('#D8CDFB'), // Lavender blue giant
      new THREE.Color('#FFE2C7'), // Soft amber / gold dwarf
      new THREE.Color('#C9DCFB'), // Cool cyan-blue
    ];

    for (let i = 0; i < count; i++) {
      const r = 16 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = spectralColors[Math.floor(Math.random() * spectralColors.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Realistic magnitude distribution: many faint stars, fewer bright ones
      const isBright = Math.random() < 0.12;
      sz[i] = isBright ? 0.32 + Math.random() * 0.22 : 0.12 + Math.random() * 0.14;

      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 1.0 + Math.random() * 2.5; // Natural twinkling speed
    }

    return [pos, col, sz, ph, sp];
  }, []);

  // Distant volumetric nebula clouds
  const [nebulaPositions, nebulaColors] = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const nebulaColorsList = [
      new THREE.Color('#241544'),
      new THREE.Color('#17193F'),
      new THREE.Color('#381B3E'),
      new THREE.Color('#121C35'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = -14 - Math.random() * 8;

      const c = nebulaColorsList[Math.floor(Math.random() * nebulaColorsList.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  // Subtle individual starlight twinkling scintillation
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.012;
      const mat = starsRef.current.material as THREE.PointsMaterial;
      // Gentle overall atmospheric breath
      mat.opacity = 0.82 + Math.sin(t * 1.5) * 0.08;
    }

    if (brightStarsRef.current) {
      brightStarsRef.current.rotation.y += delta * 0.012;
      const mat = brightStarsRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.9 + Math.sin(t * 2.2) * 0.1;
    }

    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += delta * 0.003;
    }
  });

  return (
    <group>
      {/* Background Starfield with Soft Gaussian Stellar Sprite Texture */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Subtle Volumetric Nebula Veil */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nebulaPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nebulaColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={3.2}
          map={starTexture}
          vertexColors
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
