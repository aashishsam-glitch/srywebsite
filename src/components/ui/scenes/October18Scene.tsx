'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConstellationNode } from '@/types';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { soundEngine } from '@/lib/audioSynth';

interface October18SceneProps {
  dateDisplay: string;
  themeQuote: string;
  nodes: ConstellationNode[];
  discoveredNodeIds: number[];
  onSelectNode: (node: ConstellationNode) => void;
  allDiscovered: boolean;
  onContinue: () => void;
}

export const October18Scene: React.FC<October18SceneProps> = ({
  dateDisplay,
  themeQuote,
  nodes,
  discoveredNodeIds,
  onSelectNode,
  allDiscovered,
  onContinue,
}) => {
  const [activeNode, setActiveNode] = useState<ConstellationNode | null>(null);

  const handleNodeClick = (node: ConstellationNode) => {
    setActiveNode(node);
    onSelectNode(node);
    soundEngine.playChime(440 + node.id * 75);
  };

  const handleNext = () => {
    soundEngine.playChime(659.25); // E5
    onContinue();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-between min-h-screen py-16 px-4 sm:px-6 select-none pointer-events-none">
      {/* Top Header: The Date & Concept */}
      <div className="pointer-events-auto flex flex-col items-center text-center max-w-xl mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xs uppercase tracking-[0.3em] text-roseSoft/90 mb-2 font-light"
        >
          A Memory Under the Stars
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif text-ivoryWarm font-normal tracking-wide drop-shadow-[0_2px_20px_rgba(243,165,199,0.3)]"
        >
          {dateDisplay}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="text-sm sm:text-base text-ivoryWarm/75 font-serif italic mt-3 max-w-md"
        >
          &ldquo;{themeQuote}&rdquo;
        </motion.p>
      </div>

      {/* Middle: Active Statement Card */}
      <div className="pointer-events-auto w-full max-w-lg my-auto py-4">
        <AnimatePresence mode="wait">
          {activeNode ? (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-7 rounded-2xl bg-midnight-800/80 border border-roseSoft/30 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-roseSoft/60 to-transparent" />
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                <span className="text-xs uppercase tracking-widest text-champagne/90 font-light">
                  {activeNode.label}
                </span>
              </div>
              <p className="text-lg sm:text-xl font-serif text-ivoryWarm font-light leading-relaxed">
                &ldquo;{activeNode.statement}&rdquo;
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="p-5 rounded-xl bg-midnight-900/40 border border-white/5 backdrop-blur-sm text-center"
            >
              <p className="text-sm text-ivoryWarm/60 font-serif italic">
                Tap each glowing star below to unlock its reflection...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Interactive Star Nodes and Next Button */}
      <div className="pointer-events-auto w-full max-w-xl mx-auto flex flex-col items-center gap-5 pb-6">
        {/* Star Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
          {nodes.map((node) => {
            const isDiscovered = discoveredNodeIds.includes(node.id);
            const isCurrent = activeNode?.id === node.id;

            return (
              <button
                key={node.id}
                type="button"
                style={{ touchAction: 'manipulation' }}
                onClick={() => handleNodeClick(node)}
                className={`relative px-3 py-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 text-xs font-serif flex items-center justify-between gap-1.5 cursor-pointer pointer-events-auto ${
                  isCurrent
                    ? 'bg-roseSoft/20 border-roseSoft text-ivoryWarm shadow-[0_0_15px_rgba(243,165,199,0.3)]'
                    : isDiscovered
                    ? 'bg-midnight-700/60 border-lavender/40 text-ivoryWarm/90 hover:bg-midnight-700/80'
                    : 'bg-midnight-800/50 border-white/10 text-ivoryWarm/60 hover:text-ivoryWarm hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDiscovered ? 'bg-roseSoft shadow-[0_0_6px_#F3A5C7]' : 'bg-white/40'
                    }`}
                  />
                  <span className="truncate">{node.label}</span>
                </div>
                {isDiscovered && <Check className="w-3.5 h-3.5 text-roseSoft flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Progress & Heart Constellation Status */}
        <div className="flex items-center gap-2 text-xs text-lavender/70 font-light">
          <span>{discoveredNodeIds.length} of 4 stars revealed</span>
          {allDiscovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-roseSoft font-serif"
            >
              — heart constellation connected ♡
            </motion.span>
          )}
        </div>

        {/* Action Button once all stars are discovered */}
        <AnimatePresence>
          {allDiscovered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6 }}
            >
              <button
                type="button"
                onClick={handleNext}
                style={{ touchAction: 'manipulation' }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-roseSoft/20 via-lavender/25 to-roseSoft/20 hover:from-roseSoft/30 hover:to-lavender/35 active:scale-95 border border-roseSoft/50 backdrop-blur-xl shadow-[0_0_25px_rgba(243,165,199,0.35)] text-ivoryWarm font-serif tracking-wider text-base sm:text-lg flex items-center gap-2.5 transition-all duration-300 cursor-pointer pointer-events-auto"
              >
                <span>Read what I wrote for you</span>
                <ArrowRight className="w-4 h-4 text-roseSoft" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
