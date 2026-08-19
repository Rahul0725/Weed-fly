---
name: game-audio-sfx
description: >-
  Game audio engineering guide for Web Audio API sound synthesis, spatial 3D audio,
  dynamic interactive music systems, and procedural retro sound effect synthesis.
---

# Game Audio & Sound Design Guide

Web Audio API allows real-time, low-latency procedural audio synthesis directly in modern browser games without heavy audio file downloads.

---

## 1. Web Audio API Procedural SFX Synth

```typescript
export class SoundFX {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playLaser() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playJump() {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playExplosion() {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start(ctx.currentTime);
  }
}
```

---

## 2. Spatial 3D Audio with PannerNode

```typescript
export function playSpatialSound(audioBuffer: AudioBuffer, listenerPos: [number, number, number], emitterPos: [number, number, number], ctx: AudioContext) {
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;

  const panner = ctx.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;

  panner.positionX.setValueAtTime(emitterPos[0], ctx.currentTime);
  panner.positionY.setValueAtTime(emitterPos[1], ctx.currentTime);
  panner.positionZ.setValueAtTime(emitterPos[2], ctx.currentTime);

  ctx.listener.positionX.setValueAtTime(listenerPos[0], ctx.currentTime);
  ctx.listener.positionY.setValueAtTime(listenerPos[1], ctx.currentTime);
  ctx.listener.positionZ.setValueAtTime(listenerPos[2], ctx.currentTime);

  source.connect(panner);
  panner.connect(ctx.destination);
  source.start(ctx.currentTime);
}
```
