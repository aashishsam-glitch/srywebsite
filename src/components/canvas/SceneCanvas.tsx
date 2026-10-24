'use client';

import React, { Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { MagneticHeart } from './MagneticHeart';
import { CosmicBackground } from './CosmicBackground';
import { FloatingGarden3D } from './FloatingGarden3D';
import { Fireflies } from './Fireflies';
import { DriftingPetals } from './DriftingPetals';
import { Constellation3D } from './Constellation3D';
import { OrbitingPetals3D } from './OrbitingPetals3D';
import { FinalParticleDrift } from './FinalParticleDrift';
import { CameraController } from './CameraController';
import { WebGlFallback } from './WebGlFallback';
import { ConstellationNode, PetalThought } from '@/types';

interface SceneCanvasProps {
  sceneId: number;
  reducedMotion: boolean;
  constellationNodes: ConstellationNode[];
  discoveredConstellationIds: number[];
  onSelectConstellationNode: (node: ConstellationNode) => void;
  allConstellationsDiscovered: boolean;
  unsaidPetals: PetalThought[];
  selectedPetalId: string | null;
  onSelectPetal: (petal: PetalThought) => void;
  isDrifting: boolean;
  onDriftComplete?: () => void;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({
  sceneId,
  reducedMotion,
  constellationNodes,
  discoveredConstellationIds,
  onSelectConstellationNode,
  allConstellationsDiscovered,
  unsaidPetals,
  selectedPetalId,
  onSelectPetal,
  isDrifting,
  onDriftComplete,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === false) {
    return <WebGlFallback />;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#090D23']} />
          <fog attach="fog" args={['#090D23', 4, 18]} />

          {/* Atmospheric Cinematic Lighting */}
          <ambientLight intensity={0.7} color="#B7A5F7" />
          <directionalLight
            position={[4, 5, 4]}
            intensity={1.2}
            color="#FFF3E8"
          />
          <directionalLight
            position={[-4, -3, -2]}
            intensity={0.6}
            color="#F3A5C7"
          />
          <pointLight position={[0, -1, 3]} intensity={0.9} color="#D78DAC" distance={8} />

          {/* Camera Animation & Parallax */}
          <CameraController sceneId={sceneId} reducedMotion={reducedMotion} />

          {/* Starfield & Nebula */}
          <CosmicBackground />

          {/* Central Magnetic 3D Heart */}
          <MagneticHeart sceneId={sceneId} isDrifting={isDrifting} />

          {/* Scene 2: Floating Garden Elements */}
          <FloatingGarden3D visible={sceneId === 1} />

          {/* Scene 3: Constellation */}
          <Constellation3D
            nodes={constellationNodes}
            discoveredNodeIds={discoveredConstellationIds}
            onSelectNode={onSelectConstellationNode}
            allDiscovered={allConstellationsDiscovered}
            visible={sceneId === 2}
          />

          {/* Scene 5: Orbiting Petals */}
          <OrbitingPetals3D
            petals={unsaidPetals}
            selectedPetalId={selectedPetalId}
            onSelectPetal={onSelectPetal}
            visible={sceneId === 4}
          />

          {/* Scene 6: Finale Drift */}
          <FinalParticleDrift
            isDrifting={isDrifting}
            onDriftComplete={onDriftComplete}
          />

          {/* Living Micro-Particles & Drift */}
          <Fireflies count={reducedMotion ? 25 : 65} sceneId={sceneId} />
          <DriftingPetals count={reducedMotion ? 15 : 35} active={sceneId !== 2} />
        </Suspense>
      </Canvas>
    </div>
  );
};
