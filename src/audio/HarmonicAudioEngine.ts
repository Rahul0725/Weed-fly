/**
 * TOPOLOGICA: Generative Synesthetic Web Audio API Synthesizer
 */

import { HarmonicFrequencies, HarmonicRatioLock, SoundSettings } from '../game/types';

export class HarmonicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Drone Synthesizer Nodes
  private droneOscs: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private binauralLeft: OscillatorNode | null = null;
  private binauralRight: OscillatorNode | null = null;

  // Reverb Convolver / Delay
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  private isRunning: boolean = false;
  private settings: SoundSettings = {
    masterVolume: 0.8,
    musicVolume: 0.7,
    sfxVolume: 0.9,
    binauralDrone: true,
    microtonalReverb: true
  };

  constructor() {}

  public init() {
    if (this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.settings.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music Channel
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.settings.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // SFX Channel
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Filter & Acoustic Delay Line
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(800, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(4.0, this.ctx.currentTime);

      this.delayNode = this.ctx.createDelay(1.0);
      this.delayNode.delayTime.setValueAtTime(0.28, this.ctx.currentTime);
      this.delayGain = this.ctx.createGain();
      this.delayGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.delayNode);
      this.delayGain.connect(this.musicGain);

      this.filterNode.connect(this.musicGain);
      this.filterNode.connect(this.delayNode);

      this.startDroneSynthesizer();
      this.isRunning = true;
    } catch (e) {
      console.warn('Audio Context initialization failed:', e);
    }
  }

  public resume() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private startDroneSynthesizer() {
    if (!this.ctx || !this.filterNode) return;

    const now = this.ctx.currentTime;
    const voiceRatios = [1.0, 1.5, 2.0, 2.5, 3.0, 4.236]; // Root, 5th, Octave, 10th, 12th, Golden Ratio overtone
    const baseFreq = 65.41; // C2

    this.droneOscs = [];
    this.droneGains = [];

    voiceRatios.forEach((ratio, idx) => {
      if (!this.ctx || !this.filterNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * ratio, now);

      const targetGain = 0.08 / (idx + 1);
      gain.gain.setValueAtTime(targetGain, now);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);

      this.droneOscs.push(osc);
      this.droneGains.push(gain);
    });

    // Binaural Beats Generator (Theta/Gamma pulse for cosmic focus)
    if (this.settings.binauralDrone) {
      const merger = this.ctx.createChannelMerger(2);
      
      this.binauralLeft = this.ctx.createOscillator();
      this.binauralLeft.type = 'sine';
      this.binauralLeft.frequency.setValueAtTime(108.0, now);

      this.binauralRight = this.ctx.createOscillator();
      this.binauralRight.type = 'sine';
      this.binauralRight.frequency.setValueAtTime(114.0, now); // 6 Hz Theta binaural beat

      const binGain = this.ctx.createGain();
      binGain.gain.setValueAtTime(0.04, now);

      this.binauralLeft.connect(merger, 0, 0);
      this.binauralRight.connect(merger, 0, 1);
      merger.connect(binGain);
      binGain.connect(this.musicGain!);

      this.binauralLeft.start(now);
      this.binauralRight.start(now);
    }
  }

  /**
   * Real-time Continuous Audio Modulation from Game Harmonics
   */
  public updateHarmonics(harmonics: HarmonicFrequencies, lock: HarmonicRatioLock, entropyPercent: number) {
    if (!this.ctx || !this.isRunning || !this.filterNode) return;

    const now = this.ctx.currentTime;
    const rootFreq = 55 + harmonics.alpha * 18; // 55Hz - 163Hz

    const voiceRatios = [1.0, lock.ratio, 2.0, lock.ratio * 1.5, 3.0, 1.61803];

    this.droneOscs.forEach((osc, idx) => {
      const targetF = rootFreq * voiceRatios[idx % voiceRatios.length];
      osc.frequency.setTargetAtTime(targetF, now, 0.08);
    });

    // Resonant Filter Cutoff driven by Beta + W-Phase Gamma + Precision
    const baseCutoff = 400 + harmonics.beta * 450 + Math.sin(harmonics.gamma) * 300;
    const resonanceBoost = lock.precision * 1200;
    this.filterNode.frequency.setTargetAtTime(baseCutoff + resonanceBoost, now, 0.06);
    this.filterNode.Q.setTargetAtTime(3.0 + lock.precision * 8.0, now, 0.06);

    // Harmonic Gains
    this.droneGains.forEach((g, idx) => {
      const vol = (0.05 + lock.precision * 0.08) / (idx + 1);
      g.gain.setTargetAtTime(vol, now, 0.1);
    });
  }

  /**
   * SFX: Pluck Phase-Tether String
   */
  public playTetherPluck(freqMultiplier: number = 1.0, tension: number = 0.5) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const baseFreq = 220 * freqMultiplier * (0.8 + tension * 0.4);
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.35);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Damped lowpass filter for acoustic string resonance
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq * 2, now);
    filter.Q.setValueAtTime(6.0, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  /**
   * SFX: Constructive Resonance Collapse (Crystal Shatter + Deep Bass Implosion)
   */
  public playResonanceCollapse(precision: number, ratioName: string) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // 1. Deep Sub-Bass Implosion
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.5);

    subGain.gain.setValueAtTime(0.35 * (0.5 + precision * 0.5), now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    subOsc.connect(subGain);
    subGain.connect(this.sfxGain);
    subOsc.start(now);
    subOsc.stop(now + 0.55);

    // 2. Multi-Voice Shimmer Chimes (Pythagorean Arpeggio)
    const chordFrequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    chordFrequencies.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      const delay = now + i * 0.04;

      chime.type = 'triangle';
      chime.frequency.setValueAtTime(freq * (1.0 + precision * 0.2), delay);

      chimeGain.gain.setValueAtTime(0.12 * precision, delay);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, delay + 0.6);

      chime.connect(chimeGain);
      chimeGain.connect(this.sfxGain);
      chime.start(delay);
      chime.stop(delay + 0.6);
    });
  }

  /**
   * SFX: 4D Hyper-Phase Shift Sweep
   */
  public playPhaseShift() {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * SFX: Sector Cleared Fanfare
   */
  public playSectorClear() {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.09;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(time);
      osc.stop(time + 0.8);
    });
  }

  public updateSettings(settings: SoundSettings) {
    this.settings = settings;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(settings.masterVolume, this.ctx.currentTime, 0.05);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(settings.musicVolume, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(settings.sfxVolume, this.ctx.currentTime, 0.05);
    }
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }
}

export const harmonicAudioEngine = new HarmonicAudioEngine();
