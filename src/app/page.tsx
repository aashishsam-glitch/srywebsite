'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SceneId, ConstellationNode, PetalThought, ExperienceContent } from '@/types';
import { defaultExperienceContent } from '@/config/experienceContent';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { AmbientAudioControls } from '@/components/ui/AmbientAudioControls';
import { SceneNavigator } from '@/components/ui/SceneNavigator';
import { OpeningScene } from '@/components/ui/scenes/OpeningScene';
import { FloatingGardenScene } from '@/components/ui/scenes/FloatingGardenScene';
import { October18Scene } from '@/components/ui/scenes/October18Scene';
import { ApologyLetterScene } from '@/components/ui/scenes/ApologyLetterScene';
import { UnsaidThingsScene } from '@/components/ui/scenes/UnsaidThingsScene';
import { FinaleScene } from '@/components/ui/scenes/FinaleScene';
import { AnimatePresence, motion } from 'framer-motion';

// Dynamically load R3F Canvas to prevent SSR canvas issues
const SceneCanvas = dynamic(
  () => import('@/components/canvas/SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ExperiencePage() {
  const [content, setContent] = useState<ExperienceContent>(defaultExperienceContent);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScene, setCurrentScene] = useState<SceneId>(0);
  const [maxSceneVisited, setMaxSceneVisited] = useState<SceneId>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Constellation state
  const [discoveredConstellationIds, setDiscoveredConstellationIds] = useState<number[]>([1]);
  const allConstellationsDiscovered = discoveredConstellationIds.length >= content.constellationThoughts.length;

  // Petals state
  const [selectedPetal, setSelectedPetal] = useState<PetalThought | null>(null);

  // Finale drift state
  const [isDrifting, setIsDrifting] = useState(false);

  // Initial setup: content fetch & motion preference
  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReduced);
    }

    // Fetch editable content from backend endpoint with seamless fallback
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setContent(json.data);
          }
        }
      } catch (err) {
        console.warn('Using default content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const goToScene = (scene: SceneId) => {
    setCurrentScene(scene);
    if (scene > maxSceneVisited) {
      setMaxSceneVisited(scene);
    }
  };

  const handleSelectConstellationNode = (node: ConstellationNode) => {
    if (!discoveredConstellationIds.includes(node.id)) {
      setDiscoveredConstellationIds((prev) => [...prev, node.id]);
    }
  };

  const handleReplay = () => {
    setIsDrifting(false);
    setSelectedPetal(null);
    setCurrentScene(0);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#090D23] select-none">
      {/* Bespoke Loading Screen */}
      <LoadingScreen isLoading={isLoading} name={content.recipient.name} />

      {/* Persistent Audio Controls */}
      <AmbientAudioControls />

      {/* 3D WebGL Canvas Layer */}
      <SceneCanvas
        sceneId={currentScene}
        reducedMotion={reducedMotion}
        constellationNodes={content.constellationThoughts}
        discoveredConstellationIds={discoveredConstellationIds}
        onSelectConstellationNode={handleSelectConstellationNode}
        allConstellationsDiscovered={allConstellationsDiscovered}
        unsaidPetals={content.unsaidPetals}
        selectedPetalId={selectedPetal?.id || null}
        onSelectPetal={setSelectedPetal}
        isDrifting={isDrifting}
        onDriftComplete={() => {}}
      />

      {/* UI Scenes Layer */}
      <div className="relative z-20 w-full h-full pointer-events-none">
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <motion.div
              key="scene-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <OpeningScene
                greeting={content.recipient.greeting}
                subGreeting={content.recipient.subGreeting}
                onEnter={() => goToScene(1)}
              />
            </motion.div>
          )}

          {currentScene === 1 && (
            <motion.div
              key="scene-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <FloatingGardenScene onContinue={() => goToScene(2)} />
            </motion.div>
          )}

          {currentScene === 2 && (
            <motion.div
              key="scene-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <October18Scene
                dateDisplay={content.eventDate.display}
                themeQuote={content.eventDate.themeQuote}
                nodes={content.constellationThoughts}
                discoveredNodeIds={discoveredConstellationIds}
                onSelectNode={handleSelectConstellationNode}
                allDiscovered={allConstellationsDiscovered}
                onContinue={() => goToScene(3)}
              />
            </motion.div>
          )}

          {currentScene === 3 && (
            <motion.div
              key="scene-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <ApologyLetterScene
                paragraphs={content.letter.paragraphs}
                greeting={content.letter.greeting}
                closing={content.letter.closing}
                signature={content.letter.signature}
                onContinue={() => goToScene(4)}
              />
            </motion.div>
          )}

          {currentScene === 4 && (
            <motion.div
              key="scene-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <UnsaidThingsScene
                petals={content.unsaidPetals}
                selectedPetal={selectedPetal}
                onSelectPetal={setSelectedPetal}
                onContinue={() => goToScene(5)}
              />
            </motion.div>
          )}

          {currentScene === 5 && (
            <motion.div
              key="scene-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <FinaleScene
                closingThoughts={content.finale.closingThoughts}
                actionButtonText={content.finale.actionButtonText}
                postDriftMessage={content.finale.postDriftMessage}
                postDriftSubtext={content.finale.postDriftSubtext}
                onDriftTrigger={() => setIsDrifting(true)}
                isDrifting={isDrifting}
                onReplay={handleReplay}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Scene Navigator */}
      <SceneNavigator
        currentScene={currentScene}
        maxSceneVisited={maxSceneVisited}
        onSelectScene={goToScene}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
      />
    </main>
  );
}
