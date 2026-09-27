class CosmicAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    if (!this.ctx) return true;

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startSpaceDrone();
      this.playChime(580, 'sine', 0.15, 0.05);
    } else {
      this.stopSpaceDrone();
    }

    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private startSpaceDrone() {
    if (!this.ctx || this.isMuted) return;

    this.stopSpaceDrone();

    try {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.04, now + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, now);

      // Deep fundamental harmonic drone
      const freqs = [55, 110, 164.8, 220];
      this.oscillators = freqs.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), now);

        const subGain = this.ctx!.createGain();
        subGain.gain.setValueAtTime(1 / (i + 1.8), now);

        osc.connect(subGain);
        subGain.connect(filter);
        osc.start(now);
        return osc;
      });

      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);
    } catch {
      // Audio context error fallback
    }
  }

  private stopSpaceDrone() {
    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
          });
          this.oscillators = [];
          this.droneGain?.disconnect();
          this.droneGain = null;
        }, 900);
      } catch {
        this.oscillators = [];
        this.droneGain = null;
      }
    }
  }

  public playHoverBlip() {
    if (this.isMuted || !this.ctx) return;
    this.playChime(880, 'sine', 0.04, 0.015);
  }

  public playClickBeep() {
    if (this.isMuted || !this.ctx) return;
    this.playChime(1200, 'triangle', 0.08, 0.03);
  }

  public playSparkChime() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Dual harmonic shimmering frequencies: 1320Hz and 1760Hz
      [1320, 1760, 2200].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + idx * 0.03 + 0.2);

        gain.gain.setValueAtTime(0.025 / (idx + 1), now + idx * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.03 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + idx * 0.03 + 0.32);
      });
    } catch {
      // Audio fallback
    }
  }

  public playTelemetrySweep() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.15);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback
    }
  }

  private playChime(freq: number, type: OscillatorType, duration: number, volume: number) {
    try {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    } catch {
      // Audio fallback
    }
  }
}

export const audioService = new CosmicAudioService();
