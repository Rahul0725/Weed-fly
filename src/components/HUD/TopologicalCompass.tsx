/**
 * TOPOLOGICA: 4D Topological Coordinate Compass & W-Slice Radar
 */

import React, { useEffect, useRef } from 'react';
import { SingularityEntity, ConduitLink } from '../../game/types';

interface TopologicalCompassProps {
  singularities: SingularityEntity[];
  conduits: ConduitLink[];
  gamma: number;
  size?: number;
}

export const TopologicalCompass: React.FC<TopologicalCompassProps> = ({
  singularities,
  conduits,
  gamma,
  size = 130
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.42;

      // 1. Radar Grid & Concentric Rings
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.33, 0, Math.PI * 2);
      ctx.arc(cx, cy, radius * 0.66, 0, Math.PI * 2);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Axis lines
      ctx.beginPath();
      ctx.moveTo(cx, 4);
      ctx.lineTo(cx, size - 4);
      ctx.moveTo(4, cy);
      ctx.lineTo(size - 4, cy);
      ctx.stroke();

      // 2. Rotating W-Phase Pointer Line
      const angleW = gamma;
      const wx = cx + Math.cos(angleW) * radius;
      const wy = cy + Math.sin(angleW) * radius;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(wx, wy);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Conduits on Radar
      for (const c of conduits) {
        const s1 = singularities.find(s => s.id === c.sourceId);
        const s2 = singularities.find(s => s.id === c.targetId);
        if (!s1 || !s2) continue;

        const x1 = cx + (s1.x / 2.5) * radius;
        const y1 = cy + (s1.y / 2.5) * radius;
        const x2 = cx + (s2.x / 2.5) * radius;
        const y2 = cy + (s2.y / 2.5) * radius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.4 + c.resonanceHarmony * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 4. Draw Singularities on Radar
      for (const s of singularities) {
        const sx = cx + (s.x / 2.5) * radius;
        const sy = cy + (s.y / 2.5) * radius;

        const r = Math.round(s.color[0] * 255);
        const g = Math.round(s.color[1] * 255);
        const b = Math.round(s.color[2] * 255);

        // Halo indicating stability
        if (s.stability > 0.1) {
          ctx.beginPath();
          ctx.arc(sx, sy, 6 + s.stability * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(250, 204, 21, ${s.stability * 0.3})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.wShadowIntensity})`;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [singularities, conduits, gamma, size]);

  return (
    <div className="relative flex flex-col items-center bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-xl p-2 shadow-lg shadow-emerald-950/40">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-lg"
      />
      <div className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 mt-1">
        4D Hyper-Radar
      </div>
    </div>
  );
};
