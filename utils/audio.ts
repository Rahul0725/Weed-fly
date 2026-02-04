import { GAME_OVER_SOUND_URL, GAME_OVER_SOUND_URL_2 } from '../constants';

class AudioController {
  private ctx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;
  private crashSound: HTMLAudioElement | null = null;
  private crashSound2: HTMLAudioElement | null = null;
  private crashCount: number = 0;

  private getContext(): AudioContext {
    if (!this.ctx) {
      // Cross-browser support
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    return this.ctx;
  }

  public async resume() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  public preloadMusic(url: string) {
    if (!this.bgMusic) {
      this.bgMusic = new Audio(url);
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.4; // Background music slightly lower volume
      this.bgMusic.preload = 'auto';
      this.bgMusic.load();
    } else if (this.bgMusic.src !== url) {
      this.bgMusic.src = url;
      this.bgMusic.load();
    }
  }

  public playMusic(url: string) {
    // Create audio element if it doesn't exist
    if (!this.bgMusic) {
      this.bgMusic = new Audio(url);
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.4; 
      this.bgMusic.preload = 'auto';
    } 
    // Update src if changed (though we typically use one track)
    else if (this.bgMusic.src !== url) {
       this.bgMusic.src = url;
    }
    
    // Play if paused
    if (this.bgMusic.paused) {
      const playPromise = this.bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn("Background music autoplay prevented or waiting for user interaction", e);
        });
      }
    }
  }

  public stopMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  public playJump() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Simple "wing flap" sound (rising sine)
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(350, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Ignore audio errors
    }
  }

  public playScore() {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // "Coin" sound (high pitch ping)
      osc.type = 'square';
      const now = ctx.currentTime;
      
      // Little arpeggio effect
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.setValueAtTime(1500, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      // Ignore audio errors
    }
  }

  public playCrash() {
    this.crashCount++;
    try {
      // Check if it's an even numbered attempt (2nd, 4th, 6th...)
      const isSecondAttempt = this.crashCount % 2 === 0;

      if (isSecondAttempt) {
        if (!this.crashSound2) {
          this.crashSound2 = new Audio(GAME_OVER_SOUND_URL_2);
          this.crashSound2.volume = 1.0; // Dialogue might need to be clearly heard
          this.crashSound2.preload = 'auto';
        }
        this.crashSound2.currentTime = 0;
        this.crashSound2.play().catch(e => {
          console.warn("Crash sound 2 play failed", e);
        });
      } else {
        if (!this.crashSound) {
          this.crashSound = new Audio(GAME_OVER_SOUND_URL);
          this.crashSound.volume = 0.6;
          this.crashSound.preload = 'auto';
        }
        this.crashSound.currentTime = 0;
        this.crashSound.play().catch(e => {
          console.warn("Crash sound 1 play failed", e);
        });
      }
      
    } catch (e) {
      // Fallback or ignore
      console.warn("Audio error", e);
    }
  }
}

export const audioController = new AudioController();