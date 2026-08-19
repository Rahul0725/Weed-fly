import { GhostPoint } from '../types';

export class GhostTelemetry {
  private recordedPoints: GhostPoint[] = [];
  private bestRunPoints: GhostPoint[] = [];
  private isRecording: boolean = false;

  startRecording() {
    this.recordedPoints = [];
    this.isRecording = true;
  }

  recordTick(time: number, y: number, velocity: number) {
    if (!this.isRecording) return;
    this.recordedPoints.push({
      t: Math.round(time * 100) / 100,
      y: Math.round(y * 10) / 10,
      v: Math.round(velocity * 10) / 10
    });
  }

  saveIfBest(score: number, currentHighScore: number) {
    this.isRecording = false;
    if (score > currentHighScore && this.recordedPoints.length > 0) {
      this.bestRunPoints = [...this.recordedPoints];
      try {
        localStorage.setItem('flappy_ghost_telemetry', JSON.stringify(this.bestRunPoints));
      } catch {}
    }
  }

  loadBestRun() {
    try {
      const saved = localStorage.getItem('flappy_ghost_telemetry');
      if (saved) {
        this.bestRunPoints = JSON.parse(saved);
      }
    } catch {}
  }

  getGhostPosition(elapsedTime: number): { y: number; v: number } | null {
    if (this.bestRunPoints.length === 0) return null;
    const roundedT = Math.round(elapsedTime * 100) / 100;

    // Linear search or clamp
    const point = this.bestRunPoints.find(p => p.t >= roundedT);
    if (point) {
      return { y: point.y, v: point.v };
    }
    const lastPoint = this.bestRunPoints[this.bestRunPoints.length - 1];
    return lastPoint ? { y: lastPoint.y, v: lastPoint.v } : null;
  }
}

export const ghostTelemetry = new GhostTelemetry();
