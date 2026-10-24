'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PetalThought } from '@/types';
import { soundEngine } from '@/lib/audioSynth';

interface OrbitingPetals3DProps {
  petals: PetalThought[];
  selectedPetalId: string | null;
  onSelectPetal: (petal: PetalThought) => void;
  visible: boolean;
}

function SinglePetalMesh({
  petal,
  isSelected,
  onClick,
  orbitAngle,
}: {
  petal: PetalThought;
  isSelected: boolean;
  onClick: () => void;
  orbitAngle: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  // Procedural 3D Petal Geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.2, 0.25, 0.35, 0.55, 0.2, 1.0);
    shape.bezierCurveTo(0.1, 1.25, -0.1, 1.25, -0.2, 1.0);
    shape.bezierCurveTo(-0.35, 0.55, -0.2, 0.25, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 12);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const z = Math.sin(y * Math.PI) * 0.12;
      pos.setZ(i, z);
    }
    geom.computeVertexNormals();
    geom.center();
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Orbit coordinates around central heart
    const radius = 2.5;
    const currentAngle = orbitAngle + t * 0.15;
    const targetX = Math.cos(currentAngle) * radius;
    const targetZ = Math.sin(currentAngle) * radius;
    const targetY = Math.sin(t * 1.2 + orbitAngle) * 0.25;

    meshRef.current.position.set(targetX, targetY, targetZ);
    meshRef.current.rotation.y = -currentAngle + Math.PI / 2;
    meshRef.current.rotation.x = Math.sin(t * 0.8 + orbitAngle) * 0.2;
    meshRef.current.rotation.z = Math.cos(t * 0.9 + orbitAngle) * 0.15;

    const targetScale = isSelected ? 1.4 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
  });

  return (
    <group ref={meshRef} onClick={onClick}>
      {/* Hit box for easy tapping */}
      <mesh>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={petal.color}
          emissive={petal.color}
          emissiveIntensity={isSelected ? 0.6 : 0.25}
          roughness={0.2}
          transmission={0.45}
          thickness={0.6}
          clearcoat={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export const OrbitingPetals3D: React.FC<OrbitingPetals3DProps> = ({
  petals,
  selectedPetalId,
  onSelectPetal,
  visible,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = visible ? 1 : 0.001;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 3);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {petals.map((petal) => (
        <SinglePetalMesh
          key={petal.id}
          petal={petal}
          isSelected={selectedPetalId === petal.id}
          orbitAngle={petal.initialAngle}
          onClick={() => {
            soundEngine.playChime(600);
            onSelectPetal(petal);
          }}
        />
      ))}
    </group>
  );
};
