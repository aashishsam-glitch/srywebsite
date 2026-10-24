'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ConstellationNode } from '@/types';
import { soundEngine } from '@/lib/audioSynth';
import { getCoronaTexture, getDiffractionSpikeTexture } from './StarTextures';

interface Constellation3DProps {
  nodes: ConstellationNode[];
  discoveredNodeIds: number[];
  selectedNodeId: number | null;
  onSelectNode: (node: ConstellationNode) => void;
  allDiscovered: boolean;
  visible: boolean;
}

// Individual realistic glowing star component
function RealisticStarNode({
  node,
  isDiscovered,
  isSelected,
  onClick,
}: {
  node: ConstellationNode;
  isDiscovered: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Sprite>(null);
  const spikesRef = useRef<THREE.Sprite>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const coronaTexture = useMemo(() => getCoronaTexture(), []);
  const spikeTexture = useMemo(() => getDiffractionSpikeTexture(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural stellar scintillation (twinkling)
    const twinkle = Math.sin(t * 3.5 + node.id * 1.7) * 0.15 + Math.cos(t * 2.1 + node.id) * 0.1;
    const isLit = isDiscovered || isSelected;
    const baseScale = isSelected ? 1.25 : isLit ? 1.0 : 0.65;
    const currentScale = baseScale + twinkle * (isLit ? 0.08 : 0.04);

    if (coreRef.current) {
      coreRef.current.scale.setScalar(currentScale);
    }

    // Atmospheric Corona Glow breathing
    if (coronaRef.current) {
      const targetOpacity = isSelected ? 1.0 : isLit ? 0.88 + twinkle * 0.1 : 0.35 + twinkle * 0.08;
      const mat = coronaRef.current.material as THREE.SpriteMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 5);
      coronaRef.current.scale.setScalar((isSelected ? 2.0 : isLit ? 1.5 : 0.8) + twinkle * 0.1);
    }

    // 4-Point Diffraction Cross Spikes (flare visible when lit up)
    if (spikesRef.current) {
      const targetOpacity = isSelected ? 1.0 : isLit ? 0.82 + twinkle * 0.15 : 0;
      const mat = spikesRef.current.material as THREE.SpriteMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4);
      mat.rotation += delta * 0.05;
      spikesRef.current.scale.setScalar((isSelected ? 2.8 : isLit ? 2.2 : 0.1) + twinkle * 0.2);
    }

    if (lightRef.current) {
      const targetIntensity = isSelected ? 2.6 + twinkle * 0.4 : isLit ? 1.8 + twinkle * 0.25 : 0.3;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 4);
    }
  });

  return (
    <group
      ref={groupRef}
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
    >
      {/* Invisible enlarged hit target for effortless clicking/tapping */}
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 1. Hot Stellar Photosphere Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* 2. Chromosphere Inner Colored Tint */}
      <mesh>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshBasicMaterial
          color={node.color}
          transparent
          opacity={isDiscovered || isSelected ? 0.85 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Soft Atmospheric Corona Glow */}
      <sprite ref={coronaRef}>
        <spriteMaterial
          map={coronaTexture}
          color={node.color}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* 4. Realistic 4-Point Diffraction Spike Flare */}
      <sprite ref={spikesRef}>
        <spriteMaterial
          map={spikeTexture}
          color="#FFF2FA"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* 5. Physical Point Light casting starlight into space */}
      <pointLight
        ref={lightRef}
        color={node.color}
        intensity={0.4}
        distance={4.2}
        decay={2}
      />
    </group>
  );
}

export const Constellation3D: React.FC<Constellation3DProps> = ({
  nodes,
  discoveredNodeIds,
  selectedNodeId,
  onSelectNode,
  allDiscovered,
  visible,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const heartLinesRef = useRef<THREE.LineSegments>(null);
  const baseLinesRef = useRef<THREE.LineSegments>(null);

  // Line segments connecting the 4 primary constellation stars
  const baseLineGeometry = useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        points.push(...nodes[i].position);
        points.push(...nodes[j].position);
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, [nodes]);

  // When all stars are discovered, generate the smooth glowing heart constellation curve
  const heartLineGeometry = useMemo(() => {
    const points: number[] = [];
    const count = 48; // Smooth resolution
    for (let i = 0; i < count; i++) {
      const t1 = (i / count) * Math.PI * 2;
      const t2 = ((i + 1) / count) * Math.PI * 2;

      // Parametric 2D heart curve
      const x1 = 1.6 * 16 * Math.pow(Math.sin(t1), 3) * 0.08;
      const y1 = 1.6 * (13 * Math.cos(t1) - 5 * Math.cos(2 * t1) - 2 * Math.cos(3 * t1) - Math.cos(4 * t1)) * 0.08;

      const x2 = 1.6 * 16 * Math.pow(Math.sin(t2), 3) * 0.08;
      const y2 = 1.6 * (13 * Math.cos(t2) - 5 * Math.cos(2 * t2) - 2 * Math.cos(3 * t2) - Math.cos(4 * t2)) * 0.08;

      points.push(x1, y1 + 0.1, 0);
      points.push(x2, y2 + 0.1, 0);
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    const targetScale = visible ? 1 : 0.001;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);

    // Subtle gentle cosmic drift
    groupRef.current.rotation.z = Math.sin(t * 0.25) * 0.025;
    groupRef.current.position.y = Math.cos(t * 0.45) * 0.04;

    // Base constellation connection lines subtle shimmer
    if (baseLinesRef.current) {
      const mat = baseLinesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.28 + Math.sin(t * 1.8) * 0.1;
    }

    // Glowing heart constellation fade-in
    if (heartLinesRef.current) {
      const mat = heartLinesRef.current.material as THREE.LineBasicMaterial;
      const targetOpacity = allDiscovered ? 0.9 + Math.sin(t * 2.5) * 0.1 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 2.5);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base Starlight Filaments between stars */}
      <lineSegments ref={baseLinesRef} geometry={baseLineGeometry}>
        <lineBasicMaterial
          color="#B7A5F7"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Heart constellation starlight filament formed on discovery */}
      <lineSegments ref={heartLinesRef} geometry={heartLineGeometry}>
        <lineBasicMaterial
          color="#F3A5C7"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Individual Realistic Star Nodes */}
      {nodes.map((node) => {
        const isDiscovered = discoveredNodeIds.includes(node.id);
        const isSelected = selectedNodeId === node.id;
        return (
          <RealisticStarNode
            key={node.id}
            node={node}
            isDiscovered={isDiscovered}
            isSelected={isSelected}
            onClick={() => {
              soundEngine.playChime(440 + node.id * 80);
              onSelectNode(node);
            }}
          />
        );
      })}
    </group>
  );
};
