'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PetalThought } from '@/types';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/audioSynth';

interface UnsaidThingsSceneProps {
  petals: PetalThought[];
  selectedPetal: PetalThought | null;
  onSelectPetal: (petal: PetalThought | null) => void;
  onContinue: () => void;
}

export const UnsaidThingsScene: React.FC<UnsaidThingsSceneProps> = ({
  petals,
  selectedPetal,
  onSelectPetal,
  onContinue,
}) => {
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);

  const handlePetalClick = (petal: PetalThought) => {
    onSelectPetal(petal);
    soundEngine.playChime(550);
    if (!discoveredIds.includes(petal.id)) {
      setDiscoveredIds((prev) => [...prev, petal.id]);
    }
  };

  const handleCloseCard = () => {
    onSelectPetal(null);
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-16 px-4 sm:px-6 select-none pointer-events-none">
      {/* Top Header */}
      <div className="pointer-events-auto flex flex-col items-center text-center max-w-xl mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xs uppercase tracking-[0.3em] text-lavender/90 mb-2 font-light"
        >
          Reflections
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivoryWarm font-normal tracking-wide drop-shadow-[0_2px_20px_rgba(183,165,247,0.3)]"
        >
          A Garden of Unsaid Things
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-sm sm:text-base text-ivoryWarm/75 font-serif italic mt-3 max-w-md"
        >
          Five petals orbiting softly. Tap any petal to unfold its thought.
        </motion.p>
      </div>

      {/* Middle Card Modal if a Petal is selected */}
      <div className="pointer-events-auto w-full max-w-lg my-auto py-4">
        <AnimatePresence mode="wait">
          {selectedPetal ? (
            <motion.div
              key={selectedPetal.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 sm:p-8 rounded-3xl bg-midnight-900/90 border border-white/20 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] text-center overflow-hidden"
            >
              <button
                type="button"
                onClick={handleCloseCard}
                style={{ touchAction: 'manipulation' }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-ivoryWarm/60 hover:text-ivoryWarm transition-colors cursor-pointer pointer-events-auto"
                aria-label="Close card"
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-4"
                style={{ backgroundColor: `${selectedPetal.color}25` }}
              >
                <Sparkles className="w-5 h-5" style={{ color: selectedPetal.color }} />
              </div>

              <span
                className="text-xs uppercase tracking-widest font-light block mb-2"
                style={{ color: selectedPetal.color }}
              >
                {selectedPetal.theme}
              </span>

              <h3 className="text-xl sm:text-2xl font-serif text-ivoryWarm font-normal leading-relaxed mb-4">
                &ldquo;{selectedPetal.quote}&rdquo;
              </h3>

              <p className="text-sm font-serif italic text-ivoryWarm/75 leading-relaxed max-w-sm mx-auto">
                {selectedPetal.reflection}
              </p>
            </motion.div>
          ) : (
            <div className="h-24 flex items-center justify-center">
              <span className="text-xs text-ivoryWarm/40 tracking-widest uppercase font-light">
                {discoveredIds.length} of 5 petals explored
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Petal Selector Chips and Final Scene Button */}
      <div className="pointer-events-auto w-full max-w-xl mx-auto flex flex-col items-center gap-5 pb-6">
        {/* Chips row */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          {petals.map((petal) => {
            const isSelected = selectedPetal?.id === petal.id;
            const isDiscovered = discoveredIds.includes(petal.id);

            return (
              <button
                key={petal.id}
                type="button"
                style={{ touchAction: 'manipulation' }}
                onClick={() => handlePetalClick(petal)}
                className={`px-3.5 py-2 rounded-full border backdrop-blur-md transition-all duration-300 text-xs sm:text-sm font-serif flex items-center gap-2 cursor-pointer pointer-events-auto ${
                  isSelected
                    ? 'bg-white/15 border-white text-ivoryWarm shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : isDiscovered
                    ? 'bg-midnight-700/60 border-white/20 text-ivoryWarm/90 hover:bg-midnight-700/80'
                    : 'bg-midnight-800/50 border-white/10 text-ivoryWarm/60 hover:text-ivoryWarm hover:border-white/25'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: petal.color }}
                />
                <span>{petal.theme}</span>
              </button>
            );
          })}
        </div>

        {/* Action Button: To Finale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            type="button"
            onClick={() => {
              soundEngine.playChime(659.25);
              onContinue();
            }}
            style={{ touchAction: 'manipulation' }}
            className="px-7 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/20 hover:border-roseSoft/60 backdrop-blur-xl text-ivoryWarm font-serif tracking-wider text-sm sm:text-base flex items-center gap-2.5 transition-all duration-300 shadow-lg cursor-pointer pointer-events-auto"
          >
            <span>A final thought for you</span>
            <ArrowRight className="w-4 h-4 text-roseSoft" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};
