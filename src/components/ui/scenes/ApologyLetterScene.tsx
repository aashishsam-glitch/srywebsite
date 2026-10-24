'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, FastForward, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/audioSynth';

interface ApologyLetterSceneProps {
  paragraphs: string[];
  greeting: string;
  closing: string;
  signature: string;
  onContinue: () => void;
}

export const ApologyLetterScene: React.FC<ApologyLetterSceneProps> = ({
  paragraphs,
  greeting,
  closing,
  signature,
  onContinue,
}) => {
  const [visibleCount, setVisibleCount] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-reveal next paragraph every 4.5 seconds if autoplaying
  useEffect(() => {
    if (isAutoPlaying && visibleCount < paragraphs.length) {
      timerRef.current = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
        soundEngine.playChime(440 + visibleCount * 30);
      }, 4500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoPlaying, visibleCount, paragraphs.length]);

  const handleNextParagraph = () => {
    if (visibleCount < paragraphs.length) {
      setVisibleCount((prev) => prev + 1);
      soundEngine.playChime(520);
    }
  };

  const handleShowAll = () => {
    setVisibleCount(paragraphs.length);
    setIsAutoPlaying(false);
    soundEngine.playChime(600);
  };

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const isComplete = visibleCount >= paragraphs.length;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-6 select-none pointer-events-none">
      {/* Intimate Letter Container */}
      <div className="pointer-events-auto w-full max-w-2xl mx-auto flex flex-col my-auto">
        {/* Glassmorphism Digital Letter Card */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-midnight-900/85 border border-white/15 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.65)] text-left overflow-hidden"
        >
          {/* Subtle warm rim light accents */}
          <div className="absolute top-0 inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-roseSoft/50 to-transparent" />
          <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-roseSoft/10 blur-3xl pointer-events-none" />

          {/* Letter Controls Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne/80 font-light">
              An apology
            </span>

            {/* Reading Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleAutoPlay}
                disabled={isComplete}
                title={isAutoPlaying ? 'Pause reveal' : 'Resume auto-reveal'}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-ivoryWarm/70 hover:text-ivoryWarm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleNextParagraph}
                disabled={isComplete}
                title="Next paragraph"
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-ivoryWarm/70 hover:text-ivoryWarm transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-serif"
              >
                Next
              </button>

              <button
                onClick={handleShowAll}
                disabled={isComplete}
                title="Read full letter instantly"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-roseSoft hover:text-roseSoft-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-serif"
              >
                <FastForward className="w-3 h-3" />
                <span>Show all</span>
              </button>
            </div>
          </div>

          {/* Letter Salutation */}
          <h2 className="text-2xl sm:text-3xl font-serif text-ivoryWarm font-normal mb-5 tracking-wide">
            {greeting}
          </h2>

          {/* Letter Paragraphs with Progressive Reveal */}
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
            {paragraphs.slice(0, visibleCount).map((para, index) => {
              const isHighlight = para === 'I\'m sorry.' || para.includes('I\'m genuinely sorry');
              return (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`text-base sm:text-lg leading-relaxed font-serif font-light ${
                    isHighlight
                      ? 'text-roseSoft font-normal italic tracking-wide text-lg sm:text-xl py-1'
                      : 'text-ivoryWarm/90'
                  }`}
                >
                  {para}
                </motion.p>
              );
            })}
          </div>

          {/* Letter Closing & Signature */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="text-xs text-ivoryWarm/60 uppercase tracking-widest font-light">
                    {closing}
                  </p>
                  <p className="text-sm font-serif italic text-champagne/90 mt-1">
                    {signature}
                  </p>
                </div>

                {/* Continue button */}
                <button
                  onClick={onContinue}
                  className="px-6 py-2.5 rounded-full bg-roseSoft/20 hover:bg-roseSoft/30 border border-roseSoft/50 text-ivoryWarm font-serif tracking-wider text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer"
                >
                  <span>A garden of unsaid things</span>
                  <ArrowRight className="w-4 h-4 text-roseSoft" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
