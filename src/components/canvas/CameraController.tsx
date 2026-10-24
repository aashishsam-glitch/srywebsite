'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CameraControllerProps {
  sceneId: number;
  reducedMotion: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  sceneId,
  reducedMotion,
}) => {
  const currentPos = useRef(new THREE.Vector3(0, 0, 5));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Target positions per scene
  const sceneCameraTargets: Record<number, { pos: [number, number, number]; lookAt: [number, number, number] }> = {
    0: { pos: [0, 0.1, 4.6], lookAt: [0, 0, 0] },
    1: { pos: [0, 0.3, 4.2], lookAt: [0, -0.2, 0] },
    2: { pos: [0, 0, 4.5], lookAt: [0, 0, 0] },
    3: { pos: [0, 0.2, 4.8], lookAt: [0, 0.1, 0] },
    4: { pos: [0, 0.2, 5.0], lookAt: [0, 0, 0] },
    5: { pos: [0, 0.5, 5.2], lookAt: [0, 0.3, 0] },
  };

  useFrame((state, delta) => {
    const config = sceneCameraTargets[sceneId] || sceneCameraTargets[0];
    const parallaxFactor = reducedMotion ? 0 : 0.4;

    const targetX = config.pos[0] + state.pointer.x * parallaxFactor;
    const targetY = config.pos[1] + state.pointer.y * (parallaxFactor * 0.6);
    const targetZ = config.pos[2];

    const targetLookX = config.lookAt[0] + state.pointer.x * (parallaxFactor * 0.2);
    const targetLookY = config.lookAt[1] + state.pointer.y * (parallaxFactor * 0.2);
    const targetLookZ = config.lookAt[2];

    const damping = reducedMotion ? 1.5 : 2.2;

    currentPos.current.x = THREE.MathUtils.damp(currentPos.current.x, targetX, damping, delta);
    currentPos.current.y = THREE.MathUtils.damp(currentPos.current.y, targetY, damping, delta);
    currentPos.current.z = THREE.MathUtils.damp(currentPos.current.z, targetZ, damping, delta);

    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, targetLookX, damping, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, targetLookY, damping, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, targetLookZ, damping, delta);

    state.camera.position.copy(currentPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
};
