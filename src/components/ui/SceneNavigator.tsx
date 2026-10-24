'use client';

import React from 'react';
import { SceneId } from '@/types';
import { motion } from 'framer-motion';
import { Sparkles, Wind } from 'lucide-react';

interface SceneNavigatorProps {
  currentScene: SceneId;
  maxSceneVisited: SceneId;
  onSelectScene: (scene: SceneId) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

const sceneLabels: Record<SceneId, string> = {
  0: 'Beginning',
  1: 'The Garden',
  2: 'October 18',
  3: 'The Letter',
  4: 'Unsaid Things',
  5: 'Final Message',
};

export const SceneNavigator: React.FC<SceneNavigatorProps> = ({
  currentScene,
  maxSceneVisited,
  onSelectScene,
  reducedMotion,
  onToggleReducedMotion,
}) => {
  return (
    <div className="fixed bottom-5 inset-x-0 z-40 flex items-center justify-between px-6 pointer-events-none">
      {/* Reduced motion button */}
      <button
        onClick={onToggleReducedMotion}
        aria-label={reducedMotion ? 'Enable full 3D motion' : 'Reduce motion'}
        className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-800/60 hover:bg-midnight-700/80 border border-white/10 backdrop-blur-md text-xs text-ivoryWarm/60 hover:text-ivoryWarm transition-all shadow-sm"
      >
        {reducedMotion ? (
          <>
            <Wind className="w-3.5 h-3.5 text-lavender" />
            <span className="hidden sm:inline">Motion: Soft</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span className="hidden sm:inline">Motion: Full</span>
          </>
        )}
      </button>

      {/* Progress Dots with Scene Labels */}
      <nav aria-label="Experience scenes" className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-800/60 border border-white/10 backdrop-blur-md shadow-lg">
        {([0, 1, 2, 3, 4, 5] as SceneId[]).map((id) => {
          const isActive = currentScene === id;
          const isUnlocked = id <= maxSceneVisited;

          return (
            <button
              key={id}
              onClick={() => isUnlocked && onSelectScene(id)}
              disabled={!isUnlocked}
              title={sceneLabels[id]}
              aria-label={`Go to ${sceneLabels[id]}`}
              aria-current={isActive ? 'step' : undefined}
              className={`relative flex items-center justify-center p-1.5 rounded-full transition-all duration-300 ${
                isUnlocked ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-30'
              }`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-5 h-2 bg-roseSoft shadow-[0_0_10px_#F3A5C7]'
                    : isUnlocked
                    ? 'w-2 h-2 bg-ivoryWarm/60 hover:bg-ivoryWarm'
                    : 'w-2 h-2 bg-white/20'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Discreet scene counter indicator */}
      <div className="pointer-events-auto text-xs text-ivoryWarm/50 font-serif tracking-widest hidden sm:block">
        {sceneLabels[currentScene]} ({currentScene + 1}/6)
      </div>
    </div>
  );
};
