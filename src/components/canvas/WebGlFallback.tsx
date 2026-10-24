'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const WebGlFallback: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#050714] via-[#090D23] to-[#171333] z-0">
      {/* Distant soft nebula glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-rose-500/10 blur-[120px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />

      {/* Floating Ambient Starlight Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{
            width: (i % 3) + 2 + 'px',
            height: (i % 3) + 2 + 'px',
            top: `${(i * 17) % 95}%`,
            left: `${(i * 23) % 95}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: (i % 5) * 0.4,
          }}
        />
      ))}

      {/* Stylized Floating Center Heart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-48 h-48 relative flex items-center justify-center opacity-85"
          animate={{
            y: [-8, 8, -8],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-36 h-36 drop-shadow-[0_0_35px_rgba(243,165,199,0.4)]"
            fill="url(#heartGrad)"
          >
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F8C6DB" />
                <stop offset="50%" stopColor="#F3A5C7" />
                <stop offset="100%" stopColor="#B7A5F7" />
              </linearGradient>
            </defs>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
