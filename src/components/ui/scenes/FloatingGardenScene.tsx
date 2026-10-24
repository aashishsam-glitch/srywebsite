'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '@/lib/audioSynth';

interface FloatingGardenSceneProps {
  onContinue: () => void;
}

export const FloatingGardenScene: React.FC<FloatingGardenSceneProps> = ({ onContinue }) => {
  const handleClick = () => {
    soundEngine.playChime(587.33); // D5
    onContinue();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-end pb-28 md:pb-32 min-h-screen px-6 text-center select-none pointer-events-none">
      <div className="pointer-events-auto max-w-lg mx-auto flex flex-col items-center">
        {/* Subtle scene header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="text-xs uppercase tracking-[0.3em] text-champagne/80 mb-3 font-light"
        >
          A quiet breath
        </motion.div>

        {/* Narrative text: "Before anything else, there's something I should tell you." */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.8, ease: 'easeOut' }}
          className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-ivoryWarm leading-relaxed drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]"
        >
          Before anything else, there&apos;s something I should tell you.
        </motion.h2>

        {/* Understated button: "There's something I owe you" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease: 'easeOut' }}
          className="mt-8"
        >
          <button
            onClick={handleClick}
            className="group px-7 py-3 rounded-full bg-midnight-800/60 hover:bg-white/[0.12] border border-white/15 hover:border-lavender/50 backdrop-blur-md shadow-lg hover:shadow-[0_0_24px_rgba(183,165,247,0.35)] text-ivoryWarm/90 hover:text-ivoryWarm tracking-wider font-serif text-base sm:text-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <span>There&apos;s something I owe you</span>
            <span className="text-lavender transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
