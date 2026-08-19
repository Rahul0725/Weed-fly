import { SoundSettings } from '../types';

class StudioAudioController {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;

  // Stems
  private bassGain: GainNode | null = null;
  private arpGain: GainNode | null = null;
  private chordGain: GainNode | null = null;
  private leadGain: GainNode | null = null;

  private isBgmPlaying: boolean = false;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private bgmStep: number = 0;

  private settings: SoundSettings = {
    masterVolume: 0.8,
    musicVolume: 0.5,
    sfxVolume: 0.8,
    muted: false
  };

  private initAudio() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.settings.muted ? 0 : this.settings.masterVolume, this.ctx.currentTime);

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(20000, this.ctx.currentTime);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(this.settings.musicVolume, this.ctx.currentTime);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, this.ctx.currentTime);

    // Dynamic Stem Buses
    this.bassGain = this.ctx.createGain();
    this.arpGain = this.ctx.createGain();
    this.chordGain = this.ctx.createGain();
    this.leadGain = this.ctx.createGain();

    this.bassGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.chordGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.arpGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Unlocks at 2x combo
    this.leadGain.gain.setValueAtTime(0.0, this.ctx.currentTime); // Unlocks at 4x combo

    this.bassGain.connect(this.musicGain);
    this.chordGain.connect(this.musicGain);
    this.arpGain.connect(this.musicGain);
    this.leadGain.connect(this.musicGain);

    this.musicGain.connect(this.filterNode);
    this.sfxGain.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  public async resume() {
    try {
      this.initAudio();
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
    } catch (err) {
      console.warn("Audio resume bypassed", err);
    }
  }

  public setLowPass(cutoffHz: number = 20000, rampTime: number = 0.2) {
    if (!this.filterNode || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.filterNode.frequency.cancelScheduledValues(now);
    this.filterNode.frequency.exponentialRampToValueAtTime(Math.max(100, cutoffHz), now + rampTime);
  }

  // Update dynamic stems based on active combo multiplier (1x to 5x)
  public setComboMultiplier(multiplier: number) {
    if (!this.arpGain || !this.leadGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    const arpVol = multiplier >= 2 ? 0.6 : 0.0;
    const leadVol = multiplier >= 4 ? 0.7 : 0.0;
    this.arpGain.gain.linearRampToValueAtTime(arpVol, now + 0.3);
    this.leadGain.gain.linearRampToValueAtTime(leadVol, now + 0.3);
  }

  public setSettings(newSettings: Partial<SoundSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (!this.ctx || !this.masterGain || !this.musicGain || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const effectiveMaster = this.settings.muted ? 0 : this.settings.masterVolume;
    this.masterGain.gain.setValueAtTime(effectiveMaster, now);
    this.musicGain.gain.setValueAtTime(this.settings.musicVolume, now);
    this.sfxGain.gain.setValueAtTime(this.settings.sfxVolume, now);
  }

  public getSettings(): SoundSettings {
    return { ...this.settings };
  }

  public playJump() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  public playScore(comboCount: number = 1) {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const rootFreq = 523.25;
      const pentatonic = [1.0, 1.125, 1.25, 1.5, 1.667, 2.0, 2.25];
      const scaleIdx = (comboCount - 1) % pentatonic.length;
      const freq1 = rootFreq * pentatonic[scaleIdx];
      const freq2 = freq1 * 1.5;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq1, now);
      osc2.frequency.setValueAtTime(freq2, now + 0.04);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now + 0.04);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch (e) {}
  }

  public playGraze() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  public playPowerUpCollect() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.15, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.25);
      });
    } catch (e) {}
  }

  public playShieldBreak() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {}
  }

  public playCrash() {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(40, now + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
    } catch (e) {}
  }

  // 5-Stem Adaptive Dynamic Procedural Synthesizer
  public startMusic() {
    this.initAudio();
    if (this.isBgmPlaying || !this.ctx || !this.musicGain) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];

    const playChordStep = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.chordGain) return;
      const now = this.ctx.currentTime;
      const chord = chords[this.bgmStep % chords.length];
      this.bgmStep++;

      chord.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * (i === 0 ? 0.5 : 1.0), now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.chordGain!);

        osc.start(now);
        osc.stop(now + 1.8);
      });
    };

    playChordStep();
    this.bgmInterval = setInterval(playChordStep, 1600);
  }

  public stopMusic() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const audioController = new StudioAudioController();