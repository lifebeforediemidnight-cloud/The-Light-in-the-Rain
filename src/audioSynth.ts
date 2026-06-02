/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AtmosphereType = 'morning' | 'grind' | 'storm' | 'tea' | 'resilience' | 'silent';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Active playing nodes
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private rainNoiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private rainGainNode: GainNode | null = null;
  private atmosphericInterval: any = null;
  private currentAtmosphere: AtmosphereType = 'silent';

  constructor() {
    // Audio Context is initialized lazily upon user interaction
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music Channel
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX Channel
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      console.log("Interactive Web Audio Synthesizer initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize Web Audio context:", e);
    }
  }

  public setMasterVolume(v: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(v, this.ctx.currentTime + 0.1);
    }
  }

  public setChannelVolumes(music: number, sfx: number) {
    this.init();
    if (this.ctx) {
      if (this.musicGain) this.musicGain.gain.linearRampToValueAtTime(music, this.ctx.currentTime + 0.1);
      if (this.sfxGain) this.sfxGain.gain.linearRampToValueAtTime(sfx, this.ctx.currentTime + 0.1);
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public stopAll() {
    this.currentAtmosphere = 'silent';
    if (this.atmosphericInterval) {
      clearInterval(this.atmosphericInterval);
      this.atmosphericInterval = null;
    }

    // Stop active synth oscillators
    this.activeOscillators.forEach(item => {
      try {
        item.osc.stop();
      } catch (e) {}
    });
    this.activeOscillators = [];

    // Stop rain generator
    if (this.rainNoiseNode) {
      try {
        this.rainNoiseNode.disconnect();
      } catch (e) {}
      this.rainNoiseNode = null;
    }
    if (this.rainGainNode) {
      this.rainGainNode = null;
    }
  }

  public playAtmosphere(type: AtmosphereType) {
    this.init();
    if (!this.ctx) return;
    this.resume();

    if (this.currentAtmosphere === type) return;
    this.stopAll();
    this.currentAtmosphere = type;

    const now = this.ctx.currentTime;

    switch (type) {
      case 'morning':
        this.setupMorningAtmosphere(now);
        break;
      case 'grind':
        this.setupGrindAtmosphere(now);
        break;
      case 'storm':
        this.setupStormAtmosphere(now);
        break;
      case 'tea':
        this.setupTeaAtmosphere(now);
        break;
      case 'resilience':
        this.setupResilienceAtmosphere(now);
        break;
      case 'silent':
      default:
        break;
    }
  }

  // --- ACT I: MORNING HARMONY & DETUNED DRONES ---
  private setupMorningAtmosphere(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.sfxGain) return;

    // Soft morning analog sweep strings (detuned oscillators)
    const freqs = [110, 165, 220, 330]; // A2, E3, A3, E4 (warm open chord)
    freqs.forEach((freq) => {
      if (!this.ctx || !this.musicGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      // Detune slightly for lush warmth
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 3.0);

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(startTime);

      this.activeOscillators.push({ osc, gain });

      // LFO filter slow movement for that emotional breathing morning atmosphere
      if (Math.random() > 0.5) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, startTime);
        osc.disconnect(gain);
        osc.connect(filter);
        filter.connect(gain);
      }
    });

    // Procedural Bird Chirping at random intervals
    this.atmosphericInterval = setInterval(() => {
      this.triggerProceduralChirp();
    }, 4000);
  }

  private triggerProceduralChirp() {
    if (!this.ctx || !this.sfxGain || this.currentAtmosphere !== 'morning') return;
    const now = this.ctx.currentTime;
    
    // Quick high pitch sweeping sine wave sequence
    const notes = [1200, 1500, 1300, 1700];
    const duration = 0.08;
    
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      osc.frequency.exponentialRampToValueAtTime(freq + 400, now + idx * 0.1 + duration);
      
      oscGain.gain.setValueAtTime(0, now + idx * 0.1);
      oscGain.gain.linearRampToValueAtTime(0.015, now + idx * 0.1 + 0.01);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + duration);
      
      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + duration);
    });
  }

  // --- ACT II: SHIFT GRIND & METALLIC SHUTTLES ---
  private setupGrindAtmosphere(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.sfxGain) return;

    // Fast clockwork tempo pulses and chaotic background grid
    const grHz = 120; // Heavy drone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(grHz, startTime);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, startTime);
    filter.Q.setValueAtTime(1.5, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.05, startTime + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    
    osc.start(startTime);
    this.activeOscillators.push({ osc, gain });

    // Procedural metallic clanking at constant, frantic speed
    let pulseCount = 0;
    this.atmosphericInterval = setInterval(() => {
      if (!this.ctx || !this.sfxGain) return;
      
      const clickTime = this.ctx.currentTime;
      pulseCount++;

      // Trigger a metal kitchen plate/pan clash rhythmically
      if (pulseCount % 4 === 0) {
        this.triggerProceduralMetalClatter(clickTime);
      } else {
        // Simple tick-tock clock shift
        const oscTick = this.ctx.createOscillator();
        const gainTick = this.ctx.createGain();
        oscTick.type = 'triangle';
        oscTick.frequency.setValueAtTime(pulseCount % 2 === 0 ? 800 : 600, clickTime);
        gainTick.gain.setValueAtTime(0.02, clickTime);
        gainTick.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.05);

        oscTick.connect(gainTick);
        gainTick.connect(this.sfxGain);
        oscTick.start(clickTime);
        oscTick.stop(clickTime + 0.05);
      }
    }, 450);
  }

  private triggerProceduralMetalClatter(time: number) {
    if (!this.ctx || !this.sfxGain) return;
    
    // Create multiple high frequency components (metallic)
    const rands = [800, 1150, 1600, 2200];
    rands.forEach(freq => {
      if (!this.ctx || !this.sfxGain) return;
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();

      metalOsc.type = 'triangle';
      metalOsc.frequency.setValueAtTime(freq, time);

      metalGain.gain.setValueAtTime(0.025, time);
      metalGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);

      metalOsc.connect(metalGain);
      metalGain.connect(this.sfxGain);
      metalOsc.start(time);
      metalOsc.stop(time + 0.26);
    });
  }

  // --- ACT III: PROCEDURAL RAINSTORM GENERATOR & THUNDER ---
  private setupStormAtmosphere(startTime: number) {
    if (!this.ctx || !this.sfxGain) return;

    // 1. Procedural rain noise synthesis (White noise with custom filters)
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Populate with white noise
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Node wrapper for the buffer looping
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filters to shape white noise into heavy organic rain
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1000, startTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(300, startTime);

    this.rainGainNode = this.ctx.createGain();
    this.rainGainNode.gain.setValueAtTime(0, startTime);
    this.rainGainNode.gain.linearRampToValueAtTime(0.4, startTime + 4.0); // slow pour entry

    whiteNoise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(this.rainGainNode);
    this.rainGainNode.connect(this.sfxGain);

    whiteNoise.start(startTime);
    this.rainNoiseNode = whiteNoise as any; // Cast as placeholder cache

    // 2. Slow gale modulation - oscillates lowpass filter frequency representing heavy rain sheets
    let angle = 0;
    this.atmosphericInterval = setInterval(() => {
      if (!this.ctx || this.currentAtmosphere !== 'storm') return;
      angle += 0.1;
      const mod = Math.sin(angle) * 300 + 900;
      lowpass.frequency.setValueAtTime(mod, this.ctx.currentTime);
    }, 100);
  }

  // Thunder trigger
  public triggerThunder() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.currentAtmosphere !== 'storm') return;

    const time = this.ctx.currentTime;

    // Lower rumble frequencies
    const oscBoom = this.ctx.createOscillator();
    const oscBoomGain = this.ctx.createGain();
    oscBoom.type = 'sawtooth';
    oscBoom.frequency.setValueAtTime(55, time); // A1 rumble
    oscBoom.frequency.linearRampToValueAtTime(30, time + 1.5);

    oscBoomGain.gain.setValueAtTime(0.6, time);
    oscBoomGain.gain.exponentialRampToValueAtTime(0.0001, time + 2.0);

    const filterBoom = this.ctx.createBiquadFilter();
    filterBoom.type = 'lowpass';
    filterBoom.frequency.setValueAtTime(120, time);

    oscBoom.connect(filterBoom);
    filterBoom.connect(oscBoomGain);
    oscBoomGain.connect(this.sfxGain);

    oscBoom.start(time);
    oscBoom.stop(time + 2.5);

    // High crash sizzle
    const crashOsc = this.ctx.createOscillator();
    const crashGain = this.ctx.createGain();
    crashOsc.type = 'triangle';
    crashOsc.frequency.setValueAtTime(180, time);

    crashGain.gain.setValueAtTime(0.4, time);
    crashGain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

    const filterCrash = this.ctx.createBiquadFilter();
    filterCrash.type = 'peaking';
    filterCrash.Q.setValueAtTime(6.0, time);
    filterCrash.frequency.setValueAtTime(800, time);

    crashOsc.connect(filterCrash);
    filterCrash.connect(crashGain);
    crashGain.connect(this.sfxGain);

    crashOsc.start(time);
    crashOsc.stop(time + 1.0);
  }

  // --- ACT IV: ROAD COZY TEA VENDOR ---
  private setupTeaAtmosphere(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.sfxGain) return;

    // Simple finger-style clean ambient keys (cozy, warm)
    const melody = [261.63, 311.13, 392.00, 466.16, 261.63, 349.23, 440.00]; // Em/Cmaj progression notes
    let step = 0;

    // Gentle rain patter backdrop (softer rain)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
       output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(600, startTime); // warmer, damped sound in tea stall

    this.rainGainNode = this.ctx.createGain();
    this.rainGainNode.gain.setValueAtTime(0.08, startTime);

    noise.connect(lp);
    lp.connect(this.rainGainNode);
    this.rainGainNode.connect(this.sfxGain);
    noise.start(startTime);
    this.rainNoiseNode = noise as any;

    // Smooth arpeggio progression generator
    this.atmosphericInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain) return;
      const noteTime = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(melody[step % melody.length], noteTime);
      
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.5); // long cozy decay

      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start(noteTime);
      osc.stop(noteTime + 1.8);

      step++;
    }, 1100);
  }

  // --- ACT V: GLORIOUS PARK FINISH ---
  private setupResilienceAtmosphere(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.sfxGain) return;

    // Major Chord crescendo orchestra (Cmaj7 -> Gmaj -> Fmaj -> Cmaj)
    const chordProgressions = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
      [146.83, 185.00, 220.00, 293.66], // D/G (D3, F#3, A3, D4)
      [174.61, 220.00, 261.63, 329.63]  // Fmaj7 (F3, A3, C4, E4)
    ];

    let chordIdx = 0;

    const playFullChord = (time: number, chord: number[]) => {
      chord.forEach(freq => {
        if (!this.ctx || !this.musicGain) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 6, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.07, time + 0.8); // swelling chords
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 4.5);

        // Lowpass filter for smooth orchestral creaminess
        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(800, time);

        osc.connect(lp);
        lp.connect(gain);
        gain.connect(this.musicGain);
        
        osc.start(time);
        osc.stop(time + 5.0);

        this.activeOscillators.push({ osc, gain });
      });
    };

    // Trigger initial chord immediately
    playFullChord(startTime, chordProgressions[0]);

    // Fast cheerful birds chirping in the pristine forest
    this.atmosphericInterval = setInterval(() => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Beautiful major key chord swell cycle
      if (Math.random() > 0.6) {
        chordIdx = (chordIdx + 1) % chordProgressions.length;
        playFullChord(now, chordProgressions[chordIdx]);
      }

      // Procedural chirps (more natural and high pitched)
      this.triggerGoldenParkBirds();
    }, 2800);
  }

  private triggerGoldenParkBirds() {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const startOffset = Math.random() * 0.5;
    
    // Whistle sweeps
    const startFreq = 2000 + Math.random() * 800;
    const duration = 0.15 + Math.random() * 0.1;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now + startOffset);
    osc.frequency.exponentialRampToValueAtTime(startFreq - 300, now + startOffset + duration / 2);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 500, now + startOffset + duration);

    gain.gain.setValueAtTime(0, now + startOffset);
    gain.gain.linearRampToValueAtTime(0.02, now + startOffset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.00001, now + startOffset + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now + startOffset);
    osc.stop(now + startOffset + duration + 0.05);
  }
}

// Export a single singleton instance for components to share
export const synth = new AudioSynthesizer();
