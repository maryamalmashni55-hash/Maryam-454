/**
 * Web Audio API synthesizer for futuristic medical sound effects.
 * Generates all sounds programmatically with zero external network requests.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isHeartbeatPlaying: boolean = false;
  private heartbeatIntervalId: number | null = null;
  private heartbeatVolume: number = 0.25;
  private lastBreakoutTime: number = 0;

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isHeartbeatPlaying) {
      this.stopHeartbeat();
      // Keep track that user had heartbeat enabled if desired
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getHeartbeatActive(): boolean {
    return this.isHeartbeatPlaying;
  }

  /**
   * Futuristic UI click/chirp sound
   */
  public playClick(freq = 1200) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      // Quick futuristic upward chirp
      osc.frequency.setValueAtTime(freq * 0.7, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Audio click error:', e);
    }
  }

  /**
   * Cinematic entrance sound: deep ambient resonance + organic heart thud + holographic shimmer
   */
  public playCinematicPortal() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Deep Sub-Bass drone (40Hz to 65Hz)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(38, now);
      subOsc.frequency.exponentialRampToValueAtTime(70, now + 0.8);
      subOsc.frequency.exponentialRampToValueAtTime(45, now + 1.6);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.8);

      // 2. Powerful double heartbeat thumps in the entrance
      this.triggerCardiacPulse(52, 0.12, now + 0.25, 0.45);
      this.triggerCardiacPulse(68, 0.1, now + 0.45, 0.38);

      this.triggerCardiacPulse(52, 0.12, now + 1.1, 0.4);
      this.triggerCardiacPulse(68, 0.1, now + 1.3, 0.32);

      // 3. Shimmering high harmonics
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C major chord shimmer
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f * 0.9, now + 0.1 + i * 0.04);
        osc.frequency.exponentialRampToValueAtTime(f * 1.05, now + 0.6);

        gain.gain.setValueAtTime(0.001, now + 0.1 + i * 0.04);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 0.1 + i * 0.04);
        osc.stop(now + 1.4);
      });
    } catch (e) {
      console.warn('Cinematic portal audio error:', e);
    }
  }

  /**
   * High-tech holographic modal activation sound (gentle synth chord)
   */
  public playHoloOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [440, 660, 880, 1320];

      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';

        osc.frequency.setValueAtTime(f * 0.8, now + i * 0.02);
        osc.frequency.exponentialRampToValueAtTime(f, now + 0.15);

        gain.gain.setValueAtTime(0.001, now + i * 0.02);
        gain.gain.linearRampToValueAtTime(0.04 / (i + 1), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.02);
        osc.stop(now + 0.45);
      });
    } catch (e) {
      console.warn('Holo audio error:', e);
    }
  }

  /**
   * Dual-thump organic cardiac heartbeat ("lub-dub")
   */
  public playHeartbeatThump() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // First beat: Lub (~55 Hz)
      this.triggerCardiacPulse(55, 0.08, now, this.heartbeatVolume);

      // Second beat: Dub (~75 Hz slightly sharper, 0.14s later)
      this.triggerCardiacPulse(72, 0.06, now + 0.14, this.heartbeatVolume * 0.85);
    } catch (e) {
      console.warn('Heartbeat audio error:', e);
    }
  }

  /**
   * Sonic dive into microscopic cellular tissue (Organic fluid submersion)
   */
  public playTissueDiveSound() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Soft sub fluid swell (pure warm sine, no harsh harmonics)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 1.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(60, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);

      // Subtle warm fluid rush (lowpass filtered soft noise)
      const duration = 1.0;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02; // Brown noise algorithm
        data[i] = lastOut * 1.5;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(220, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(70, now + 1.0);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.15, now + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 1.05);
    } catch (e) {}
  }

  /**
   * Pulmonary bronchial airflow sound (Natural, soothing breath in the lungs)
   */
  public playLungBronchialBreeze() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 2.8;

      // Realistic soft organic breath
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.12; // Natural pink noise
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1.2;
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.linearRampToValueAtTime(420, now + duration * 0.45);
      filter.frequency.linearRampToValueAtTime(240, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {}
  }

  /**
   * Deep chamber cardiac propulsion sound (Authentic warm anatomical lub-dub)
   */
  public playCardiacChamberThump() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // First beat: Lub (ventricular systole, 55Hz warm muffled thump)
      const sub1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const flt1 = this.ctx.createBiquadFilter();
      sub1.type = 'sine';
      sub1.frequency.setValueAtTime(58, now);
      sub1.frequency.exponentialRampToValueAtTime(34, now + 0.28);
      flt1.type = 'lowpass';
      flt1.frequency.value = 110;
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);
      sub1.connect(flt1);
      flt1.connect(gain1);
      gain1.connect(this.ctx.destination);
      sub1.start(now);
      sub1.stop(now + 0.3);

      // Second beat: Dub (semilunar closure at +0.22s, slightly higher pitch, softer)
      const sub2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      const flt2 = this.ctx.createBiquadFilter();
      sub2.type = 'sine';
      sub2.frequency.setValueAtTime(68, now + 0.22);
      sub2.frequency.exponentialRampToValueAtTime(38, now + 0.44);
      flt2.type = 'lowpass';
      flt2.frequency.value = 120;
      gain2.gain.setValueAtTime(0.001, now + 0.22);
      gain2.gain.linearRampToValueAtTime(0.28, now + 0.24);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      sub2.connect(flt2);
      flt2.connect(gain2);
      gain2.connect(this.ctx.destination);
      sub2.start(now + 0.22);
      sub2.stop(now + 0.46);
    } catch (e) {}
  }

  /**
   * Warm acoustic harmonic resonance for bone vault (Gentle, peaceful, calming)
   */
  public playBoneMatrixResonance() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Warm, soothing major triad frequencies (C4, E4, G4, C5)
      const notes = [261.63, 329.63, 392.00, 523.25];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const flt = this.ctx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(900, now);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + i * 0.08 + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(flt);
        flt.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + 2.25);
      });
    } catch (e) {}
  }

  /**
   * Emergence into full anatomical perspective (Warm, uplifting, gentle cinematic swell without ringing)
   */
  public playBreakoutExplosion() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Prevent rapid duplicate overlapping calls
      if (now - this.lastBreakoutTime < 2.0) return;
      this.lastBreakoutTime = now;

      // Soft warm low-frequency sub sine (pure, soothing, zero buzz)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      const subFilter = this.ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(140, now);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(50, now);
      sub.frequency.linearRampToValueAtTime(70, now + 0.4);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.16, now + 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

      sub.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.8);

      // Warm pure sine harmonic triad (soft, elegant, quick calm resolve)
      const notes = [440, 554.37, 659.25]; // A4, C#5, E5 (warm major harmony)
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const f = this.ctx.createBiquadFilter();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + 0.08);
        f.type = 'lowpass';
        f.frequency.setValueAtTime(650, now);

        g.gain.setValueAtTime(0.001, now + 0.08);
        g.gain.linearRampToValueAtTime(0.04 / (idx + 1), now + 0.25);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

        o.connect(f);
        f.connect(g);
        g.connect(this.ctx.destination);
        o.start(now + 0.08);
        o.stop(now + 0.95);
      });
    } catch (e) {}
  }

  /**
   * Subtle smooth whoosh for clean portal transition
   */
  public playSubtleWhoosh() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const flt = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);

      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(250, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(flt);
      flt.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {}
  }

  /**
   * Microscope optical zoom sound - smooth servo focus whir
   */
  public playMicroscopeZoom(level: number = 100) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      const baseFreq = Math.min(300 + Math.log10(Math.max(10, level)) * 180, 1200);
      osc.frequency.setValueAtTime(baseFreq * 0.85, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.12);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.Q.value = 3.0;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch (e) {}
  }

  /**
   * Microscope specimen change / pathology switch
   */
  public playMicroscopeToggle() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  /**
   * Cell probe biometric inspection chirp
   */
  public playCellProbe() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const o1 = this.ctx.createOscillator();
      const g1 = this.ctx.createGain();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(1320, now);
      o1.frequency.exponentialRampToValueAtTime(1760, now + 0.06);
      g1.gain.setValueAtTime(0.001, now);
      g1.gain.linearRampToValueAtTime(0.05, now + 0.02);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      o1.connect(g1);
      g1.connect(this.ctx.destination);
      o1.start(now);
      o1.stop(now + 0.12);
    } catch (e) {}
  }

  private triggerCardiacPulse(freq: number, duration: number, startTime: number, volume: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.5, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.8, startTime + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Background faint continuous heartbeat toggle
   */
  public startHeartbeat(bpm = 68) {
    if (this.isMuted) return;
    this.initContext();
    this.stopHeartbeat();
    this.isHeartbeatPlaying = true;

    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeatThump();

    this.heartbeatIntervalId = window.setInterval(() => {
      if (!this.isMuted && this.isHeartbeatPlaying) {
        this.playHeartbeatThump();
      }
    }, intervalMs);
  }

  public stopHeartbeat() {
    this.isHeartbeatPlaying = false;
    if (this.heartbeatIntervalId !== null) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }
  }

  public toggleHeartbeat(bpm = 68): boolean {
    if (this.isHeartbeatPlaying) {
      this.stopHeartbeat();
      return false;
    } else {
      if (this.isMuted) {
        this.isMuted = false;
      }
      this.startHeartbeat(bpm);
      return true;
    }
  }

  /**
   * Quiz Correct Answer Chime (Ascending triad)
   */
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Notes: E5 (659.25), G#5 (830.61), B5 (987.77), E6 (1318.51)
      const notes = [659.25, 830.61, 987.77, 1318.51];

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } catch (e) {
      console.warn('Quiz success chime error:', e);
    }
  }

  /**
   * Quiz Incorrect Answer Buzz (Futuristic warning buzz)
   */
  public playErrorBuzz() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.25);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {
      console.warn('Quiz error buzz error:', e);
    }
  }

  /**
   * Clinical Symptom Warning Alarm (Dual hospital telemetry beep)
   */
  public playSymptomAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Pulse 1: 980 Hz
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(980, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.13);

      // Pulse 2: 1318 Hz (shorter, 0.14s later)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318, now + 0.14);
      gain2.gain.setValueAtTime(0.09, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.27);
    } catch (e) {
      console.warn('Symptom alert error:', e);
    }
  }

  /**
   * Distinctive physiological sound for each specific organ (Disabled per user request)
   */
  public playOrganSound(_organKey?: string) {
    // Organ sound disabled per user preference
    return;
  }

  /**
   * Speak Arabic medical whisper/warning phrase using Web Speech API if supported
   */
  public speakSymptomWhisper(phrase: string) {
    if (this.isMuted) return;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Cancel previous speech to prevent backlog
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.92; // slightly slower, dramatic
        utterance.pitch = 0.85; // deep medical tone
        utterance.volume = 0.85;

        // Try to find Arabic voice
        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic'));
        if (arVoice) {
          utterance.voice = arVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  /**
   * Heavy, labored, stifled human breathing (نَفَس ثقيل ومكتوم)
   */
  public playHeavyBreath(duration = 2.4) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 3.5;

      const now = this.ctx.currentTime;
      // Inhale
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(580, now + duration * 0.45);
      // Exhale
      filter.frequency.exponentialRampToValueAtTime(190, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + duration * 0.4);
      gain.gain.linearRampToValueAtTime(0.02, now + duration * 0.5);
      gain.gain.linearRampToValueAtTime(0.18, now + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (e) {
      console.warn('Breath audio error:', e);
    }
  }

  /**
   * Realistic coughing sound bursts (كحة متقطعة واقعية)
   */
  public playCoughSound(burstCount = 2) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      for (let b = 0; b < burstCount; b++) {
        const offset = b * 0.28;
        const now = this.ctx.currentTime + offset;

        // 1. Throat vocal fold pulse (sawtooth low rumble)
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.16);

        oscGain.gain.setValueAtTime(0.24, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);

        // 2. Air burst friction noise
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(750, now);
        filter.Q.value = 1.8;

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.28, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.2);
      }
    } catch (e) {
      console.warn('Cough sound error:', e);
    }
  }

  /**
   * Ambulance emergency siren wailing in distance (تصاعد صوت صفارة الإسعاف)
   */
  public playAmbulanceSiren(duration = 5.0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';

      // Modulate frequency between 680Hz and 920Hz every 0.8s
      const cycleTime = 0.8;
      const cycles = Math.ceil(duration / cycleTime);
      for (let c = 0; c < cycles; c++) {
        const t = now + c * cycleTime;
        osc.frequency.setValueAtTime(680, t);
        osc.frequency.linearRampToValueAtTime(920, t + cycleTime * 0.5);
        osc.frequency.linearRampToValueAtTime(680, t + cycleTime);
      }

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 1.2);
      gain.gain.setValueAtTime(0.12, now + duration - 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Ambulance siren error:', e);
    }
  }

  /**
   * Hospital monitor ECG beep (جهاز نبضات القلب)
   */
  public playEcgBeep(freq = 1046) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('ECG beep error:', e);
    }
  }

  /**
   * Continuous flatline tone (صفير حاد ومستمر لجهاز القلب)
   */
  private flatlineNode: { osc: OscillatorNode; gain: GainNode } | null = null;

  /**
   * Cardiac Palpitation & Arrhythmia (خفقان وتسارع ضربات القلب الحاد وغير المنتظم)
   */
  public playPalpitation() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 5 rapid, irregular heartbeats simulating severe arrhythmia
      const beats = [0.0, 0.18, 0.42, 0.58, 0.82];

      beats.forEach((timeOffset, idx) => {
        const beatTime = now + timeOffset;
        const freq = 65 + (idx % 2) * 18;
        this.triggerCardiacPulse(freq, 0.08, beatTime, 0.45);
        this.triggerCardiacPulse(freq + 22, 0.06, beatTime + 0.11, 0.38);

        // Arterial blood rush surge
        const noiseBuffer = this.ctx!.createBuffer(1, Math.floor(this.ctx!.sampleRate * 0.14), this.ctx!.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

        const noise = this.ctx!.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(180, beatTime);
        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.001, beatTime);
        gain.gain.linearRampToValueAtTime(0.12, beatTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, beatTime + 0.13);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);
        noise.start(beatTime);
        noise.stop(beatTime + 0.14);
      });
    } catch (e) {
      console.warn('Palpitation audio error:', e);
    }
  }

  /**
   * Acute Tinnitus & Throbbing Headache Ringing (طنين الأذن الحاد والصداع النابض)
   */
  public playTinnitus(duration = 2.4) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. High frequency acute tinnitus whistle (3400 Hz pure tone with micro-vibrato)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3400, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
      gain.gain.setValueAtTime(0.20, now + duration - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);

      // 2. Throbbing low cranial pressure wave
      const throbOsc = this.ctx.createOscillator();
      const throbGain = this.ctx.createGain();
      throbOsc.type = 'triangle';
      throbOsc.frequency.setValueAtTime(45, now);
      throbOsc.frequency.linearRampToValueAtTime(60, now + 0.4);
      throbOsc.frequency.linearRampToValueAtTime(40, now + 0.8);

      throbGain.gain.setValueAtTime(0.25, now);
      throbGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      throbOsc.connect(throbGain);
      throbGain.connect(this.ctx.destination);
      throbOsc.start(now);
      throbOsc.stop(now + 1.2);
    } catch (e) {
      console.warn('Tinnitus audio error:', e);
    }
  }

  /**
   * Peripheral Neuropathy & Tingling (تنميل ووخز الأطراف العصبي)
   */
  public playNeuropathyTingle(duration = 1.6) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const count = 12;

      // Micro electric needle pulses
      for (let i = 0; i < count; i++) {
        const t = now + (i * 0.12) + (Math.random() * 0.03);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200 + Math.random() * 800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.07);
      }
    } catch (e) {
      console.warn('Neuropathy audio error:', e);
    }
  }

  /**
   * Visceral Gastrointestinal Rumble & Acid Reflux (قرقرة دهون حشوية وارتجاع حمضي)
   */
  public playVisceralReflux() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Low frequency digestive rumble
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(38, now + 0.5);
      osc.frequency.linearRampToValueAtTime(85, now + 1.1);
      osc.frequency.linearRampToValueAtTime(32, now + 1.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.95);
    } catch (e) {
      console.warn('Visceral rumble audio error:', e);
    }
  }

  /**
   * Hypoxia & Sudden Hypotension Swoosh (هبوط تروية وأكسجين ودوار الرأس)
   */
  public playHypoxiaDrop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Descending tunnel hearing effect
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 1.6);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 1.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.30, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.85);
    } catch (e) {
      console.warn('Hypoxia audio error:', e);
    }
  }

  /**
   * Intelligent Symptom Audio Dispatcher:
   * Maps any medical symptom phrase to its exact realistic audio reproduction.
   */
  public playSymptomSoundByType(phrase: string) {
    if (this.isMuted) return;
    this.initContext();

    const text = phrase.toLowerCase();

    // 1. Cough & Respiratory Symptoms
    if (text.includes('كحة') || text.includes('سعال') || text.includes('تنفس') || text.includes('نفس') || text.includes('شخير') || text.includes('صدر')) {
      this.playCoughSound(2);
      setTimeout(() => this.playHeavyBreath(1.8), 350);
      return;
    }

    // 2. Cardiac & Blood Pressure / Palpitations
    if (text.includes('قلب') || text.includes('نبض') || text.includes('خفقان') || text.includes('ضغط')) {
      this.playPalpitation();
      setTimeout(() => this.playEcgBeep(1120), 400);
      return;
    }

    // 3. Headache & Tinnitus / Neurological
    if (text.includes('صداع') || text.includes('طنين') || text.includes('أذن') || text.includes('رأس')) {
      this.playTinnitus(2.2);
      return;
    }

    // 4. Neuropathy & Tingling / Numbness
    if (text.includes('تنميل') || text.includes('وخز') || text.includes('أطراف') || text.includes('قدم')) {
      this.playNeuropathyTingle(1.8);
      return;
    }

    // 5. Digestive & Visceral Reflux / Obesity
    if (text.includes('ارتجاع') || text.includes('حمض') || text.includes('شحم') || text.includes('معدة') || text.includes('دهون') || text.includes('وزن')) {
      this.playVisceralReflux();
      return;
    }

    // 6. Anemia, Hypoxia, Dizziness, Cold Extremities
    if (text.includes('دوار') || text.includes('شحوب') || text.includes('برودة') || text.includes('إعياء') || text.includes('خمول')) {
      this.playHypoxiaDrop();
      return;
    }

    // Fallback: Urgent Telemetry Siren & Heartbeat
    this.playSymptomAlert();
    this.playHeartbeatThump();
  }

  public startFlatlineBeep(freq = 1046) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.stopFlatlineBeep();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      this.flatlineNode = { osc, gain };
    } catch (e) {
      console.warn('Flatline start error:', e);
    }
  }

  public stopFlatlineBeep() {
    if (this.flatlineNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.flatlineNode.gain.gain.linearRampToValueAtTime(0.0001, now + 0.04);
        this.flatlineNode.osc.stop(now + 0.05);
      } catch (e) {}
      this.flatlineNode = null;
    }
  }

  /**
   * Warm, emotional, introspective cinematic piano chord (نغمة بيانو سينمائية هادئة وعاطفية)
   * Plays realistic acoustic piano-like harmonic tones.
   */
  public playReflectivePianoChord(chordIndex: number = 0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Chord progressions designed for emotional human reflection
      const chords = [
        [174.61, 220.00, 261.63, 329.63], // Fmaj7 (Morning awakening, gentle)
        [146.83, 174.61, 220.00, 329.63], // Dm9 (Reflective, introspective)
        [116.54, 174.61, 233.08, 293.66], // Bb add9 (Deep human empathy)
        [130.81, 196.00, 261.63, 329.63, 392.00] // Cmaj (Warmth, hope, renewal)
      ];

      const notes = chords[chordIndex % chords.length];
      const now = this.ctx.currentTime;

      notes.forEach((freq, noteIdx) => {
        if (!this.ctx) return;
        const noteOffset = noteIdx * 0.035; // gentle natural arpeggiated touch

        // Fundamental note
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now + noteOffset);

        // Warm harmonic overtone (second harmonic with subtle detune)
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now + noteOffset);

        // Lowpass filter for warm wooden piano body resonance
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now + noteOffset);
        filter.frequency.exponentialRampToValueAtTime(320, now + noteOffset + 3.2);

        // Expressive envelope with gentle attack and long, lyrical sustain
        gain.gain.setValueAtTime(0.0001, now + noteOffset);
        gain.gain.linearRampToValueAtTime(0.08, now + noteOffset + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.04, now + noteOffset + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + noteOffset + 3.8);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now + noteOffset);
        osc2.start(now + noteOffset);
        osc1.stop(now + noteOffset + 4.0);
        osc2.stop(now + noteOffset + 4.0);
      });
    } catch (e) {
      console.warn('Piano chord error:', e);
    }
  }

  /**
   * Subtle, realistic human sigh/breath of fatigue (تنفس طبيعي هادئ)
   */
  public playGentleHumanBreath(duration = 2.4) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 2.2;

      const now = this.ctx.currentTime;
      filter.frequency.setValueAtTime(340, now);
      filter.frequency.exponentialRampToValueAtTime(520, now + duration * 0.45);
      filter.frequency.exponentialRampToValueAtTime(280, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + duration * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      console.warn('Gentle breath error:', e);
    }
  }

  /**
   * Warm ambient clinical room acoustics (همهمات وأجواء عيادة هادئة مع خطوات خافتة)
   */
  public playClinicRoomAmbience(duration = 5.0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Soft footsteps / distant murmurs (low frequency resonance)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(110, now + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(90, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 1.0);
      gain.gain.setValueAtTime(0.04, now + duration - 1.0);
      gain.gain.linearRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Clinic ambience error:', e);
    }
  }

  /**
   * Rapid comic / medical slide flipping sound (Marvel Studios style flipbook)
   */
  public playFlipbookSound(duration = 2.0) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const count = Math.floor(duration * 24); // 24 frames per second flutter

      for (let i = 0; i < count; i++) {
        const time = now + (i / 24);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + (i % 5) * 40, time);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.04, time + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.04);
      }
    } catch (e) {
      console.warn('Flipbook audio error:', e);
    }
  }

  /**
   * Epic Hollywood / Marvel Studio Fanfare:
   * Timpani roll, resonant BRAAAM bass drop, triumphant heroic brass fanfare chords,
   * celestial chimes and orchestral crescendo.
   */
  public playMarvelStudioFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Deep Sub-Bass BRAAAM (Impact)
      const braamOsc = this.ctx.createOscillator();
      const braamGain = this.ctx.createGain();
      braamOsc.type = 'sawtooth';
      braamOsc.frequency.setValueAtTime(55, now); // Low A
      braamOsc.frequency.exponentialRampToValueAtTime(32, now + 1.8);

      const braamFilter = this.ctx.createBiquadFilter();
      braamFilter.type = 'lowpass';
      braamFilter.frequency.setValueAtTime(140, now);
      braamFilter.frequency.exponentialRampToValueAtTime(60, now + 1.8);

      braamGain.gain.setValueAtTime(0.001, now);
      braamGain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      braamGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      braamOsc.connect(braamFilter);
      braamFilter.connect(braamGain);
      braamGain.connect(this.ctx.destination);
      braamOsc.start(now);
      braamOsc.stop(now + 2.2);

      // 2. Timpani rolling crescendo
      const timpaniTimes = [0.0, 0.18, 0.35, 0.5, 0.65, 0.78, 0.9, 1.0];
      timpaniTimes.forEach((t, i) => {
        if (!this.ctx) return;
        const drumOsc = this.ctx.createOscillator();
        const drumGain = this.ctx.createGain();
        drumOsc.type = 'sine';
        drumOsc.frequency.setValueAtTime(80 - i * 2, now + t);
        drumOsc.frequency.exponentialRampToValueAtTime(45, now + t + 0.12);

        const vol = 0.05 + (i / timpaniTimes.length) * 0.15;
        drumGain.gain.setValueAtTime(vol, now + t);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.15);

        drumOsc.connect(drumGain);
        drumGain.connect(this.ctx.destination);
        drumOsc.start(now + t);
        drumOsc.stop(now + t + 0.16);
      });

      // 3. Heroic Studio Brass Motif (Notes: Bb3 -> D4 -> F4 -> Bb4 -> C5 -> D5 -> F5 grand chord)
      // Timing intervals: 1.1s, 1.5s, 1.9s, 2.3s, 2.7s, 3.2s (Grand Triumphant Hit)
      const brassNotes = [
        { time: 1.1, freqs: [233.08, 466.16], dur: 0.35 },      // Bb3, Bb4
        { time: 1.5, freqs: [293.66, 587.33], dur: 0.35 },      // D4, D5
        { time: 1.9, freqs: [349.23, 698.46], dur: 0.35 },      // F4, F5
        { time: 2.3, freqs: [466.16, 932.33], dur: 0.38 },      // Bb4, Bb5
        { time: 2.7, freqs: [523.25, 1046.50], dur: 0.45 },     // C5, C6
        // Grand Triumphant Studio Climax Chord (Major Triad + Brass Power)
        { time: 3.2, freqs: [233.08, 293.66, 349.23, 466.16, 587.33, 932.33], dur: 2.5 }
      ];

      brassNotes.forEach((step) => {
        step.freqs.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'sawtooth'; // Rich brass timbre
          osc.frequency.setValueAtTime(freq, now + step.time);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(freq * 3, now + step.time);
          filter.Q.value = 2.0;

          const peakVol = step.dur > 1.0 ? 0.08 : 0.05;
          gain.gain.setValueAtTime(0.001, now + step.time);
          gain.gain.linearRampToValueAtTime(peakVol, now + step.time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + step.time + step.dur);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + step.time);
          osc.stop(now + step.time + step.dur);
        });
      });

      // 4. Shimmering Golden Celestial Chimes on the Grand Climax
      const chimes = [587.33, 880, 1174.66, 1760, 2349.32];
      chimes.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + 3.2 + i * 0.06);

        gain.gain.setValueAtTime(0.001, now + 3.2 + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.06, now + 3.2 + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 + i * 0.06 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + 3.2 + i * 0.06);
        osc.stop(now + 3.2 + i * 0.06 + 1.9);
      });
    } catch (e) {
      console.warn('Marvel fanfare audio error:', e);
    }
  }

  /**
   * Warm, hopeful transition chime as the video dissolves into the glowing 3D body
   */
  public playInspirationalDissolve() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chimeFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major pentatonic chord sparkle

      chimeFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.09, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.0);
      });
    } catch (e) {
      console.warn('Inspirational dissolve error:', e);
    }
  }
}

export const sound = new SoundEngine();
