'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import { soundEngine } from '@/lib/audioSynth';

interface FinaleSceneProps {
  closingThoughts: string[];
  actionButtonText: string;
  postDriftMessage: string;
  postDriftSubtext: string;
  onDriftTrigger: () => void;
  isDrifting: boolean;
  onReplay: () => void;
}

export const FinaleScene: React.FC<FinaleSceneProps> = ({
  closingThoughts,
  actionButtonText,
  postDriftMessage,
  postDriftSubtext,
  onDriftTrigger,
  isDrifting,
  onReplay,
}) => {
  const [hasDrifted, setHasDrifted] = useState(false);

  const handleDriftClick = () => {
    setHasDrifted(true);
    soundEngine.playStarSparkle();
    onDriftTrigger();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-6 select-none pointer-events-none">
      <div className="pointer-events-auto w-full max-w-xl mx-auto flex flex-col items-center text-center my-auto">
        <AnimatePresence mode="wait">
          {!hasDrifted ? (
            /* Pre-drift sincere message */
            <motion.div
              key="pre-drift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="p-8 sm:p-10 rounded-3xl bg-midnight-900/80 border border-white/10 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col items-center"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-champagne/80 mb-5 font-light">
                Peaceful Ending
              </div>

              <div className="space-y-4 mb-8">
                {closingThoughts.map((thought, idx) => (
                  <p
                    key={idx}
                    className={`font-serif leading-relaxed ${
                      idx === 1
                        ? 'text-lg sm:text-xl text-roseSoft font-normal italic'
                        : 'text-base sm:text-lg text-ivoryWarm/90 font-light'
                    }`}
                  >
                    {thought}
                  </p>
                ))}
              </div>

              {/* Action Button: "Let the little stars drift" */}
              <button
                onClick={handleDriftClick}
                disabled={isDrifting}
                className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-roseSoft/20 via-lavender/25 to-champagne/20 hover:from-roseSoft/35 hover:to-champagne/35 border border-white/20 hover:border-roseSoft/60 backdrop-blur-xl shadow-[0_0_30px_rgba(243,165,199,0.3)] text-ivoryWarm font-serif tracking-wider text-base sm:text-lg transition-all duration-500 flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-champagne group-hover:rotate-12 transition-transform" />
                <span>{actionButtonText}</span>
              </button>
            </motion.div>
          ) : (
            /* Post-drift peaceful tribute */
            <motion.div
              key="post-drift"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 1.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif text-ivoryWarm font-normal tracking-wide drop-shadow-[0_2px_24px_rgba(243,165,199,0.4)]"
              >
                {postDriftMessage}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: 2.0 }}
                className="text-sm sm:text-base text-ivoryWarm/70 font-serif italic mt-4 max-w-sm"
              >
                {postDriftSubtext}
              </motion.p>

              {/* Unobtrusive Replay Option */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.8 }}
                className="mt-12"
              >
                <button
                  onClick={onReplay}
                  className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 text-xs sm:text-sm text-ivoryWarm/60 hover:text-ivoryWarm transition-all duration-300 flex items-center gap-2 cursor-pointer font-serif"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Experience from the beginning</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
