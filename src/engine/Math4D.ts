/**
 * TOPOLOGICA: 4D Math & Hyper-Spatial Geometry Utilities
 */

import { HarmonicFrequencies, HarmonicRatioLock, HarmonicRatioType } from '../game/types';

export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Vec2 {
  x: number;
  y: number;
}

export class Math4D {
  static readonly PHI = 1.618033988749895; // Golden Ratio
  static readonly EULER = 2.718281828459045; // Euler's Number
  static readonly SQRT2 = 1.4142135623730951; // Tritone / Silver Ratio

  static distance4D(a: Vec4, b: Vec4): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    const dw = a.w - b.w;
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
  }

  static distance3D(a: Vec3, b: Vec3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  static length4D(v: Vec4): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z + v.w * v.w);
  }

  static normalize4D(v: Vec4): Vec4 {
    const len = Math4D.length4D(v);
    if (len < 0.000001) return { x: 0, y: 0, z: 0, w: 0 };
    return {
      x: v.x / len,
      y: v.y / len,
      z: v.z / len,
      w: v.w / len
    };
  }

  /**
   * 4D Hyper-Rotation around XW plane (rotation by angle theta)
   */
  static rotateXW(p: Vec4, theta: number): Vec4 {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      x: p.x * cos - p.w * sin,
      y: p.y,
      z: p.z,
      w: p.x * sin + p.w * cos
    };
  }

  /**
   * 4D Hyper-Rotation around YW plane
   */
  static rotateYW(p: Vec4, theta: number): Vec4 {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      x: p.x,
      y: p.y * cos - p.w * sin,
      z: p.z,
      w: p.y * sin + p.w * cos
    };
  }

  /**
   * 4D Hyper-Rotation around ZW plane
   */
  static rotateZW(p: Vec4, theta: number): Vec4 {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      x: p.x,
      y: p.y,
      z: p.z * cos - p.w * sin,
      w: p.z * sin + p.w * cos
    };
  }

  /**
   * Standard 3D rotations for camera orientation
   */
  static rotateXZ(p: Vec4, theta: number): Vec4 {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      x: p.x * cos - p.z * sin,
      y: p.y,
      z: p.x * sin + p.z * cos,
      w: p.w
    };
  }

  /**
   * Evaluates Harmonic Frequency Ratios between Alpha (Curvature) and Beta (Viscosity)
   * Checks for proximity to fundamental harmonic resonances
   */
  static evaluateHarmonicLock(
    freqs: HarmonicFrequencies, 
    toleranceBase: number = 0.08
  ): HarmonicRatioLock {
    const { alpha, beta } = freqs;
    const ratio = Math.max(alpha, beta) / Math.max(0.0001, Math.min(alpha, beta));

    const candidates: {
      type: HarmonicRatioType;
      name: string;
      targetRatio: number;
      multiplier: number;
      color: [number, number, number];
    }[] = [
      { type: 'UNISON_1_1', name: '1:1 Unison Octave', targetRatio: 1.0, multiplier: 1.2, color: [0.3, 0.8, 1.0] },
      { type: 'FOURTH_4_3', name: '4:3 Perfect Fourth', targetRatio: 4 / 3, multiplier: 1.5, color: [0.2, 1.0, 0.6] },
      { type: 'TRITONE_SQRT2', name: '√2 Harmonic Tritone', targetRatio: Math4D.SQRT2, multiplier: 1.8, color: [0.9, 0.3, 1.0] },
      { type: 'FIFTH_3_2', name: '3:2 Perfect Fifth', targetRatio: 1.5, multiplier: 2.0, color: [1.0, 0.85, 0.2] },
      { type: 'GOLDEN_PHI', name: 'Φ Golden Ratio Nexus', targetRatio: Math4D.PHI, multiplier: 2.6, color: [1.0, 0.4, 0.8] },
      { type: 'OCTAVE_2_1', name: '2:1 Super Octave', targetRatio: 2.0, multiplier: 2.2, color: [0.4, 1.0, 0.9] },
      { type: 'EULER_E', name: 'e Euler Transcendence', targetRatio: Math4D.EULER, multiplier: 3.0, color: [1.0, 0.95, 0.7] },
    ];

    let bestCandidate = candidates[0];
    let minDelta = Infinity;

    for (const cand of candidates) {
      const delta = Math.abs(ratio - cand.targetRatio);
      if (delta < minDelta) {
        minDelta = delta;
        bestCandidate = cand;
      }
    }

    if (minDelta <= toleranceBase) {
      const precision = Math.max(0, 1 - (minDelta / toleranceBase));
      return {
        type: bestCandidate.type,
        name: bestCandidate.name,
        ratio,
        ratioA: alpha,
        ratioB: beta,
        precision,
        multiplier: 1 + (bestCandidate.multiplier - 1) * precision,
        color: bestCandidate.color
      };
    }

    return {
      type: 'NONE',
      name: 'Turbulent Desynchronization',
      ratio,
      ratioA: alpha,
      ratioB: beta,
      precision: 0,
      multiplier: 1.0,
      color: [0.5, 0.5, 0.6]
    };
  }

  /**
   * Calculates 3D Screen Projection from 4D Point based on W-slice phase gamma
   */
  static project4DtoScreen(
    p: Vec4,
    gamma: number,
    screenWidth: number,
    screenHeight: number,
    camDist: number = 3.5
  ): { x: number; y: number; scale: number; visible: boolean; wShadow: number } {
    // 1. Rotate in 4D space by gamma angle around ZW & XW
    const rotated = Math4D.rotateZW(Math4D.rotateXW(p, gamma * 0.5), gamma);

    // 2. Distance from 3D camera slice along W-axis
    // As W shifts away from 0, the object fades into the 4D hyper-shadow
    const wDistance = Math.abs(rotated.w);
    const wShadow = Math.max(0, 1 - (wDistance / 2.2));

    // 3. Perspective divide in 3D
    const z = rotated.z + camDist;
    if (z <= 0.1) {
      return { x: -999, y: -999, scale: 0, visible: false, wShadow: 0 };
    }

    const fovScale = (screenHeight * 0.7) / z;
    const screenX = screenWidth / 2 + rotated.x * fovScale;
    const screenY = screenHeight / 2 - rotated.y * fovScale;

    return {
      x: screenX,
      y: screenY,
      scale: fovScale / 200,
      visible: screenX >= -50 && screenX <= screenWidth + 50 && screenY >= -50 && screenY <= screenHeight + 50,
      wShadow
    };
  }

  /**
   * Unprojects 2D screen coordinates into 4D space ray on the W=0 plane
   */
  static unprojectScreenTo4D(
    screenX: number,
    screenY: number,
    screenWidth: number,
    screenHeight: number,
    camDist: number = 3.5
  ): Vec4 {
    const normX = (screenX - screenWidth / 2) / (screenHeight * 0.7);
    const normY = -(screenY - screenHeight / 2) / (screenHeight * 0.7);
    return {
      x: normX * camDist,
      y: normY * camDist,
      z: 0,
      w: 0
    };
  }

  /**
   * Evaluates if a set of points forms a closed polygon loop and calculates its 2D area
   */
  static computeLoopArea(points: Vec2[]): number {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) * 0.5;
  }

  /**
   * Solves centroid of polygon in 4D space
   */
  static computeCentroid4D(points: Vec4[]): Vec4 {
    if (points.length === 0) return { x: 0, y: 0, z: 0, w: 0 };
    let sx = 0, sy = 0, sz = 0, sw = 0;
    for (const p of points) {
      sx += p.x;
      sy += p.y;
      sz += p.z;
      sw += p.w;
    }
    const n = points.length;
    return { x: sx / n, y: sy / n, z: sz / n, w: sw / n };
  }

  static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
}
