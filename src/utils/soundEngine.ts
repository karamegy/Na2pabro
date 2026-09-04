/**
 * Web Audio API Futuristic Sound Synthesizer for Na2la V10 PRO
 * Generates all audio procedurally with zero external asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cinematic Sub-Bass Impact Boom
  public playSubDrop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.8);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 1.2);
    } catch {
      // Ignore audio restriction errors
    }
  }

  // Biometric Scan & Auth Confirmation Tone
  public playBiometricScan() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(520, t);
      osc1.frequency.exponentialRampToValueAtTime(1240, t + 0.25);

      osc2.frequency.setValueAtTime(1040, t + 0.1);
      osc2.frequency.setValueAtTime(1560, t + 0.3);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t + 0.1);
      osc1.stop(t + 0.45);
      osc2.stop(t + 0.45);
    } catch {
      // Audio fallback
    }
  }

  // Radar Ping Sonar
  public playRadarPing() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, t);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch {
      // Fallback
    }
  }

  // Conflict Alert & Neural Resolve Tone
  public playConflictAlert(resolved: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (!resolved) {
        // Warning dual buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.setValueAtTime(240, t + 0.1);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      } else {
        // Futuristic success resolution chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, t); // D5
        osc.frequency.setValueAtTime(880, t + 0.1); // A5
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);
    } catch {
      // Fallback
    }
  }

  // Gemini OCR Scan Data Chirps
  public playOcrDataStream() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      [0, 0.06, 0.12, 0.18].forEach((offset, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400 + idx * 280, t + offset);

        gain.gain.setValueAtTime(0.09, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + offset);
        osc.stop(t + offset + 0.05);
      });
    } catch {
      // Fallback
    }
  }

  // Cinematic Camera Whoosh Sweep
  public playWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3.5;

      const t = this.ctx.currentTime;
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.exponentialRampToValueAtTime(1800, t + 0.2);
      filter.frequency.exponentialRampToValueAtTime(240, t + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(t);
      noise.stop(t + 0.4);
    } catch {
      // Fallback
    }
  }

  // Continuous Cyber Ambient Drone
  public startCyberAmbient() {
    if (this.ambientOsc) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOsc.type = 'sawtooth';
      this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);

      this.ambientOsc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start();
    } catch {
      // Fallback
    }
  }

  public stopCyberAmbient() {
    if (this.ambientOsc) {
      try {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
      } catch {
        // Ignore
      }
      this.ambientOsc = null;
      this.ambientGain = null;
    }
  }

  // Smoothly duck ambient drone when voiceover speaks for acoustic clarity
  public duckAmbient(duckRatio: number = 0.4, durationSeconds: number = 5) {
    if (this.isMuted || !this.ambientGain || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const baseGain = 0.05;
      const targetGain = baseGain * duckRatio;
      this.ambientGain.gain.cancelScheduledValues(t);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, t);
      this.ambientGain.gain.linearRampToValueAtTime(targetGain, t + 0.25);
      this.ambientGain.gain.setValueAtTime(targetGain, t + Math.max(0.5, durationSeconds - 0.5));
      this.ambientGain.gain.linearRampToValueAtTime(baseGain, t + durationSeconds);
    } catch {
      // Ignore
    }
  }

  // Glitch Distortion Burst Sound for Scene Switches
  public playGlitchTransition() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      // White noise bitcrush burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Stepped bitcrushed digital static
        data[i] = (Math.floor((Math.random() * 2 - 1) * 6) / 6);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.frequency.linearRampToValueAtTime(3600, t + 0.18);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.24, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      // Fast FM synth chirp overlay
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(180, t + 0.08);
      osc.frequency.linearRampToValueAtTime(840, t + 0.18);

      oscGain.gain.setValueAtTime(0.12, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(t);
      osc.start(t);
      noise.stop(t + 0.22);
      osc.stop(t + 0.2);
    } catch {
      // Audio fallback
    }
  }

  // Digital Wipe Laser Scanning Sweep Sound
  public playDigitalWipe() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(2400, t + 0.28);
      osc.frequency.exponentialRampToValueAtTime(440, t + 0.45);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.45);
    } catch {
      // Fallback
    }
  }
}

export const soundEngine = new SoundEngine();
