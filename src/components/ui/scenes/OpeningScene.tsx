'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '@/lib/audioSynth';

interface OpeningSceneProps {
  greeting: string;
  subGreeting: string;
  onEnter: () => void;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({
  greeting,
  subGreeting,
  onEnter,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      soundEngine.playChime(523.25);
    } catch {
      // Audio fallback
    }
    onEnter();
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center select-none pointer-events-none">
      {/* Subtitle / Tiny Intro Ribbon */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
        className="text-xs uppercase tracking-[0.35em] text-lavender/80 mb-4 font-light"
      >
        A Little Universe
      </motion.div>

      {/* Main Greeting: "Hey, Wynne." */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl sm:text-6xl md:text-7xl font-serif font-normal text-ivoryWarm tracking-wide drop-shadow-[0_4px_24px_rgba(243,165,199,0.25)]"
      >
        {greeting}
      </motion.h1>

      {/* Sub-greeting: "I made a little something for you." */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.6, ease: 'easeOut' }}
        className="text-base sm:text-lg md:text-xl text-ivoryWarm/80 font-light mt-4 mb-10 max-w-md font-serif italic"
      >
        {subGreeting}
      </motion.p>

      {/* Interactive Glassmorphism Button: "Step inside ♡" */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
        className="pointer-events-auto z-30"
      >
        <button
          type="button"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
            touchAction: 'manipulation',
          }}
          className="group relative px-9 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.18] active:scale-95 border border-white/25 hover:border-roseSoft/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(243,165,199,0.5)] text-ivoryWarm tracking-wider font-light text-base sm:text-lg transition-all duration-300 flex items-center gap-3 cursor-pointer pointer-events-auto"
        >
          {/* Subtle inner shimmer line */}
          <span className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          
          <span className="font-serif">Step inside</span>
          <span className="text-roseSoft transition-transform duration-300 group-hover:scale-125">
            ♡
          </span>
        </button>
      </motion.div>
    </div>
  );
};
