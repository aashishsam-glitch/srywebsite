'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  isLoading: boolean;
  name: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, name }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090D23] text-ivoryWarm px-6 select-none"
        >
          {/* Gentle Pulsing Heart Logo */}
          <div className="relative flex items-center justify-center mb-8">
            <motion.div
              className="absolute w-24 h-24 rounded-full bg-roseSoft/20 blur-2xl"
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.svg
              viewBox="0 0 24 24"
              className="w-12 h-12 text-roseSoft"
              fill="currentColor"
              animate={{
                scale: [1, 1.15, 1, 1.08, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </motion.svg>
          </div>

          {/* Sincere Greeting & Loading State */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl font-light tracking-wide text-ivoryWarm/90 text-center font-serif"
          >
            Gathering starlight for {name}...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xs text-lavender/70 mt-2 font-light tracking-widest uppercase"
          >
            Preparing a quiet space
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
