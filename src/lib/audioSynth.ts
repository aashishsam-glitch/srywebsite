// Procedural Web Audio Ambient Soundscape
// Generates dreamy, soothing background chords and gentle crystalline chimes on interaction.
// Respects strict user-gesture activation and provides volume/mute toggles.

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private timer: NodeJS.Timeout | null = null;

  private chords = [
    [174.61, 220.0, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
    [130.81, 196.0, 246.94, 329.63], // Cmaj7 (C3, G3, B3, E4)
    [110.0, 164.81, 220.0, 261.63],  // Am7 (A2, E3, A3, C4)
    [146.83, 196.0, 220.0, 293.66],  // Dsus2 (D3, G3, A3, D4)
  ];
  private chordIndex = 0;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(600, this.ctx.currentTime); // Soft, warm, cozy sound
      this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public async start() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.playAmbientChordLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playAmbientChordLoop() {
    const playNext = () => {
      if (!this.isPlaying || !this.ctx || !this.filterNode) return;

      const chord = this.chords[this.chordIndex];
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;

      const now = this.ctx.currentTime;
      const duration = 5.5; // slow breathing cycle

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.filterNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm sine and soft triangle blend
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Gentle pitch drift (subtle warm vibrato)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.05, now);
        lfoGain.gain.setValueAtTime(0.7, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        // Soft envelope: slow fade in, sustained warm body, gentle fade out
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.045 / chord.length, now + 1.8);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(noteGain);
        noteGain.connect(this.filterNode);

        osc.start(now);
        osc.stop(now + duration + 0.5);
      });
    };

    playNext();
    this.timer = setInterval(() => {
      if (this.isPlaying) {
        playNext();
      }
    }, 5000);
  }

  // Interactive chime for star discovery, petal unveiling, or scene progression
  public playChime(note = 523.25) { // default C5
    this.initContext();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);
      // Soft harmonic sparkle
      osc.frequency.exponentialRampToValueAtTime(note * 1.5, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(note, now + 0.35);

      chimeGain.gain.setValueAtTime(0.0001, now);
      chimeGain.gain.linearRampToValueAtTime(0.07, now + 0.04);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch {
      // AudioContext could be blocked if no user gesture
    }
  }

  // Soft starlight sparkle for the finale scene
  public playStarSparkle() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq);
      }, idx * 120);
    });
  }
}

export const soundEngine = new AudioSynthEngine();
