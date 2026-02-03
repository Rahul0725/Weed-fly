class AudioController {
  private ctx: AudioContext | null = null;
  private bgMusic: HTMLAudioElement | null = null;

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

  public playMusic(url: string) {
    // Create audio element if it doesn't exist
    if (!this.bgMusic) {
      this.bgMusic = new Audio(url);
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.4; // Background music slightly lower volume
    } 
    // Update src if changed (though we typically use one track)
    else if (this.bgMusic.src !== url) {
       this.bgMusic.src = url;
    }
    
    // Play if paused
    if (this.bgMusic.paused) {
      this.bgMusic.play().catch(e => {
        console.warn("Background music autoplay prevented by browser policy", e);
      });
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
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // "Hit" sound (descending saw)
      osc.type = 'sawtooth';
      const now = ctx.currentTime;
      
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Ignore audio errors
    }
  }
}

export const audioController = new AudioController();