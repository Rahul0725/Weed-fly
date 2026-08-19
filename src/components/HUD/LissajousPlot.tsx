/**
 * TOPOLOGICA: Real-time Lissajous Phase-Space Oscilloscope
 */

import React, { useEffect, useRef } from 'react';
import { HarmonicFrequencies, HarmonicRatioLock } from '../../game/types';

interface LissajousPlotProps {
  harmonics: HarmonicFrequencies;
  harmonicLock: HarmonicRatioLock;
  size?: number;
}

export const LissajousPlot: React.FC<LissajousPlotProps> = ({
  harmonics,
  harmonicLock,
  size = 120
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04 * harmonics.beta;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.4;

      // 1. Cyber Reticle Background
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;

      // Grid Rings
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, 4);
      ctx.lineTo(cx, size - 4);
      ctx.moveTo(4, cy);
      ctx.lineTo(size - 4, cy);
      ctx.stroke();

      // 2. Compute Lissajous Trajectory: x = sin(alpha * t), y = sin(beta * t + gamma)
      const samples = 180;
      ctx.beginPath();

      const r = Math.round(harmonicLock.color[0] * 255);
      const g = Math.round(harmonicLock.color[1] * 255);
      const b = Math.round(harmonicLock.color[2] * 255);

      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * Math.PI * 2 + time * 0.2;
        const x = cx + Math.sin(harmonics.alpha * t) * radius;
        const y = cy + Math.sin(harmonics.beta * t + harmonics.gamma) * radius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.4 + harmonicLock.precision * 0.6})`;
      ctx.lineWidth = 2 + harmonicLock.precision * 2;
      ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
      ctx.shadowBlur = 4 + harmonicLock.precision * 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Current Phase Tracer Dot
      const curX = cx + Math.sin(harmonics.alpha * time) * radius;
      const curY = cy + Math.sin(harmonics.beta * time + harmonics.gamma) * radius;
      ctx.beginPath();
      ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [harmonics, harmonicLock, size]);

  return (
    <div className="relative flex flex-col items-center bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-2 shadow-lg shadow-cyan-950/40">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-lg"
      />
      <div className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 mt-1">
        Phase Oscilloscope
      </div>
    </div>
  );
};
