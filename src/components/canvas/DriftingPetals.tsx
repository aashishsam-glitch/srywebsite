'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DriftingPetalsProps {
  count?: number;
  active?: boolean;
}

// Procedural petal curved geometry
function createPetalGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.12, 0.15, 0.22, 0.35, 0.14, 0.65);
  shape.bezierCurveTo(0.08, 0.8, -0.08, 0.8, -0.14, 0.65);
  shape.bezierCurveTo(-0.22, 0.35, -0.12, 0.15, 0, 0);

  const geom = new THREE.ShapeGeometry(shape, 24);
  // Add a delicate curve to the Z axis so the petal isn't flat
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const z = Math.sin(y * Math.PI * 1.2) * 0.05;
    pos.setZ(i, z);
  }
  geom.computeVertexNormals();
  geom.scale(0.8, 0.8, 0.8);
  return geom;
}

export const DriftingPetals: React.FC<DriftingPetalsProps> = ({ count = 40, active = true }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geom = useMemo(() => createPetalGeometry(), []);

  // Store individual petal velocities and rotation speeds
  const petalData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 12,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8 - 1,
      speedY: 0.004 + Math.random() * 0.006,
      wobbleSpeed: 0.8 + Math.random() * 1.2,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      rotSpeedX: (Math.random() - 0.5) * 0.015,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      rotSpeedZ: (Math.random() - 0.5) * 0.015,
      scale: 0.6 + Math.random() * 0.5,
    }));
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current || !active) return;

    const t = state.clock.getElapsedTime();

    petalData.forEach((p, i) => {
      // Wind-like flutter and slow downward/forward drift
      p.y -= p.speedY;
      p.x += Math.sin(t * p.wobbleSpeed + i) * 0.003;
      p.z += Math.cos(t * p.wobbleSpeed * 0.5 + i) * 0.002;

      p.rotX += p.rotSpeedX;
      p.rotY += p.rotSpeedY;
      p.rotZ += p.rotSpeedZ;

      // Wrap around
      if (p.y < -4.5) {
        p.y = 5.0;
        p.x = (Math.random() - 0.5) * 12;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rotX, p.rotY, p.rotZ);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geom, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <meshStandardMaterial
        color="#F8B8D2"
        roughness={0.4}
        metalness={0.05}
        side={THREE.DoubleSide}
        transparent
        opacity={0.88}
      />
    </instancedMesh>
  );
};
