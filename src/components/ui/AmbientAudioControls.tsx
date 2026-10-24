'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '@/lib/audioSynth';

export const AmbientAudioControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    const active = soundEngine.toggle();
    setIsPlaying(active);
  };

  return (
    <div className="fixed top-5 right-5 z-40 flex items-center gap-3">
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mute ambient soundscape' : 'Play peaceful ambient soundscape'}
        className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-midnight-800/60 hover:bg-midnight-700/80 border border-white/10 backdrop-blur-md transition-all duration-300 shadow-lg text-ivoryWarm/80 hover:text-ivoryWarm"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-roseSoft animate-pulse" />
            <span className="text-xs font-light tracking-wider hidden sm:inline text-roseSoft">
              Ambient music on
            </span>
            {/* Visualizer wave bars */}
            <div className="flex items-center gap-0.5 ml-1 h-3">
              <span className="w-0.5 h-2 bg-roseSoft/80 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-roseSoft/90 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-1.5 bg-roseSoft/80 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-ivoryWarm/50 group-hover:text-ivoryWarm/80" />
            <span className="text-xs font-light tracking-wider hidden sm:inline text-ivoryWarm/60 group-hover:text-ivoryWarm/90">
              Music off
            </span>
          </>
        )}
      </button>
    </div>
  );
};
