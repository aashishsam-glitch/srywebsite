'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ConstellationNode } from '@/types';
import { soundEngine } from '@/lib/audioSynth';

interface Constellation3DProps {
  nodes: ConstellationNode[];
  discoveredNodeIds: number[];
  onSelectNode: (node: ConstellationNode) => void;
  allDiscovered: boolean;
  visible: boolean;
}

export const Constellation3D: React.FC<Constellation3DProps> = ({
  nodes,
  discoveredNodeIds,
  onSelectNode,
  allDiscovered,
  visible,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const heartLinesRef = useRef<THREE.LineSegments>(null);

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

  // When all stars are discovered, generate the glowing heart constellation lines
  const heartLineGeometry = useMemo(() => {
    const points: number[] = [];
    const count = 36;
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

    // Subtle gentle float
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.03;
    groupRef.current.position.y = Math.cos(t * 0.5) * 0.05;

    if (heartLinesRef.current) {
      const mat = heartLinesRef.current.material as THREE.LineBasicMaterial;
      const targetOpacity = allDiscovered ? 0.85 : 0;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 2);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base fine connection lines between stars */}
      <lineSegments geometry={baseLineGeometry}>
        <lineBasicMaterial
          color="#B7A5F7"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Heart constellation lines that emerge when all thoughts are revealed */}
      <lineSegments ref={heartLinesRef} geometry={heartLineGeometry}>
        <lineBasicMaterial
          color="#F3A5C7"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </lineSegments>

      {/* Star Nodes */}
      {nodes.map((node) => {
        const isDiscovered = discoveredNodeIds.includes(node.id);
        return (
          <group
            key={node.id}
            position={node.position}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playChime(440 + node.id * 80);
              onSelectNode(node);
            }}
          >
            {/* Clickable Star Hitbox */}
            <mesh>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Glowing Core Star */}
            <mesh>
              <sphereGeometry args={[isDiscovered ? 0.14 : 0.09, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isDiscovered ? 2.2 : 1.2}
                roughness={0.2}
              />
            </mesh>

            {/* Starlight Halo */}
            <mesh>
              <ringGeometry args={[0.15, 0.24, 24]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={isDiscovered ? 0.75 : 0.3}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
