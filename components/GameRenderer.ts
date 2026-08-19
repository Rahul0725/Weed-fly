import { Biome, PipeData, PowerUp, CoinOrb, Skin, ActivePowerUp, BossEntity, WarpPortal } from '../types';
import { BIRD_SIZE, PIPE_WIDTH } from '../constants';
import { clamp } from '../utils/math';

export class GameRenderer {
  // Draw 5-Layer Parallax Background with Volumetric God Rays, Stellar Dust & Gerstner Waves
  renderBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    biome: Biome,
    scrollX: number,
    time: number
  ) {
    // 1. Sky Gradient (ACES color grading)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, biome.skyTop);
    skyGrad.addColorStop(0.7, biome.skyBottom);
    skyGrad.addColorStop(1, '#020617');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Cosmic Stellar Dust
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 25; i++) {
      const starX = ((i * 137.5 + scrollX * 0.02) % width);
      const starY = ((i * 73.1) % (height * 0.5));
      const starR = (i % 3 === 0 ? 1.5 : 0.8) + Math.sin(time * 2 + i) * 0.3;
      ctx.beginPath();
      ctx.arc(starX, starY, Math.max(0.2, starR), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Volumetric Light Shafts (God Rays)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const sunX = width * 0.75 - ((scrollX * 0.015) % (width * 1.5));
    const sunY = height * 0.16;

    for (let r = 0; r < 5; r++) {
      const rayAngle = (r * Math.PI) / 5 + Math.sin(time * 0.4 + r) * 0.08;
      const rayGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX + Math.cos(rayAngle) * 450, sunY + Math.sin(rayAngle) * 450, 320);
      rayGrad.addColorStop(0, 'rgba(254, 240, 138, 0.14)');
      rayGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.04)');
      rayGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.arc(sunX, sunY, 480, rayAngle - 0.12, rayAngle + 0.12);
      ctx.closePath();
      ctx.fill();
    }

    // Celestial Sun Core
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 80);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
    sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.4)');
    sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Distant Mountains (Layer 1 - 0.08x speed)
    ctx.fillStyle = biome.mountainColor;
    ctx.beginPath();
    ctx.moveTo(0, height);
    const mOffset = (scrollX * 0.08) % 300;
    for (let x = -300; x <= width + 300; x += 150) {
      const peakY = height * 0.52 + Math.sin((x + mOffset) * 0.015) * 60;
      ctx.lineTo(x - mOffset, peakY);
      ctx.lineTo(x + 75 - mOffset, height * 0.68);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // 5. Midground Rolling Hills (Layer 2 - 0.22x speed)
    ctx.fillStyle = biome.hillColor;
    ctx.beginPath();
    ctx.moveTo(0, height);
    const hOffset = (scrollX * 0.22) % 200;
    for (let x = -200; x <= width + 200; x += 100) {
      const hillY = height * 0.70 + Math.sin((x + hOffset) * 0.025) * 40;
      ctx.quadraticCurveTo(x - hOffset, hillY - 20, x + 100 - hOffset, height * 0.75);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  }

  // Draw Ground with Gerstner Ocean Waves, Caustics & Glowing Chevron Rails
  renderGround(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    groundHeight: number,
    biome: Biome,
    scrollX: number,
    time: number
  ) {
    const groundY = height - groundHeight;

    // Ground Bedrock Gradient
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
    groundGrad.addColorStop(0, biome.groundColor);
    groundGrad.addColorStop(1, '#020617');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, width, groundHeight);

    // Neon Accent Rail
    ctx.fillStyle = biome.groundAccent;
    ctx.shadowColor = biome.groundAccent;
    ctx.shadowBlur = 12;
    ctx.fillRect(0, groundY, width, 4);
    ctx.shadowBlur = 0;

    // Gerstner Wave Displacement Surface Lines
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= width; x += 10) {
      const wave = Math.sin((x + scrollX) * 0.05 + time * 3) * 2.5;
      if (x === 0) ctx.moveTo(x, groundY + 8 + wave);
      else ctx.lineTo(x, groundY + 8 + wave);
    }
    ctx.stroke();

    // Moving Chevron Warning Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    const chevronSpacing = 36;
    const chevronOffset = (scrollX * 0.9) % chevronSpacing;
    for (let x = -chevronSpacing; x < width + chevronSpacing; x += chevronSpacing) {
      const cx = x - chevronOffset;
      ctx.beginPath();
      ctx.moveTo(cx, groundY + 16);
      ctx.lineTo(cx + 10, groundY + 28);
      ctx.lineTo(cx, groundY + 40);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw Studio-Grade Crystal Monoliths with Plasma Conduits & PBR Bevels
  renderPipe(
    ctx: CanvasRenderingContext2D,
    pipe: PipeData,
    screenHeight: number,
    biome: Biome,
    time: number
  ) {
    const bottomY = pipe.topHeight + pipe.gap;
    const bottomHeight = screenHeight - bottomY;

    // Helper: Draw Monolith with Specular Bevels and Central Glowing Conduit
    const drawMonolith = (x: number, y: number, w: number, h: number, isTop: boolean) => {
      // 1. Base Monolith Body Gradient (PBR Metallic Core)
      const grad = ctx.createLinearGradient(x, 0, x + w, 0);
      grad.addColorStop(0, biome.pipeBodyGrad[0]);
      grad.addColorStop(0.5, biome.pipeBodyGrad[1]);
      grad.addColorStop(1, biome.pipeBodyGrad[0]);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();

      // 2. Glowing Central Plasma Conduit
      const conduitX = x + w / 2 - 2;
      const pulse = 0.5 + 0.5 * Math.sin(time * 4 + x * 0.02);
      ctx.save();
      ctx.fillStyle = biome.pipeAccent;
      ctx.shadowColor = biome.pipeAccent;
      ctx.shadowBlur = 10 * pulse;
      ctx.fillRect(conduitX, y, 4, h);
      ctx.restore();

      // 3. Specular Left Edge Highlight & Right Ambient Occlusion Shadow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(x + 1, y, 2, h);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(x + w - 3, y, 3, h);

      // 4. Heavy Reinforced Lip / End Cap
      const lipH = 22;
      const lipY = isTop ? y + h - lipH : y;
      const lipX = x - 4;
      const lipW = w + 8;

      const lipGrad = ctx.createLinearGradient(lipX, 0, lipX + lipW, 0);
      lipGrad.addColorStop(0, '#334155');
      lipGrad.addColorStop(0.5, '#64748b');
      lipGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = lipGrad;
      ctx.beginPath();
      ctx.roundRect(lipX, lipY, lipW, lipH, 4);
      ctx.fill();

      // Neon Lip Accent Line
      ctx.fillStyle = biome.pipeAccent;
      ctx.shadowColor = biome.pipeAccent;
      ctx.shadowBlur = 8;
      ctx.fillRect(lipX + 2, isTop ? lipY + lipH - 3 : lipY, lipW - 4, 3);
      ctx.shadowBlur = 0;
    };

    // Draw Top & Bottom Monoliths
    drawMonolith(pipe.x, 0, PIPE_WIDTH, pipe.topHeight, true);
    drawMonolith(pipe.x, bottomY, PIPE_WIDTH, bottomHeight, false);

    // Render In-Gate Coin Orb
    if (pipe.coin && !pipe.coin.collected) {
      this.renderCoin(ctx, pipe.coin, time);
    }

    // Render In-Gate Power-Up Capsule
    if (pipe.powerUp && !pipe.powerUp.collected) {
      this.renderPowerUp(ctx, pipe.powerUp, time);
    }

    // Render 3D Warp Portal
    if (pipe.warpPortal && !pipe.warpPortal.passed) {
      this.renderWarpPortal(ctx, pipe.warpPortal, time);
    }
  }

  // Draw 3D Spinning Golden Star Coin
  renderCoin(ctx: CanvasRenderingContext2D, coin: CoinOrb, time: number) {
    ctx.save();
    ctx.translate(coin.x, coin.y);

    const spin = Math.cos(time * 5);
    const pulse = 1.0 + Math.sin(time * 6) * 0.12;

    // Glowing Halo
    const haloGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, coin.radius * 2.2);
    haloGrad.addColorStop(0, 'rgba(253, 224, 71, 0.6)');
    haloGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Coin Outer Disc
    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(2, coin.radius * Math.abs(spin)), coin.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    // Coin Inner Specular Core
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, 0, Math.max(1, (coin.radius - 3) * Math.abs(spin)), coin.radius - 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Power-Up Capsule with Pulsating Shield/SlowMo/Magnet Glow
  renderPowerUp(ctx: CanvasRenderingContext2D, powerUp: PowerUp, time: number) {
    ctx.save();
    ctx.translate(powerUp.x, powerUp.y);

    const pulse = 1.0 + Math.sin(time * 5) * 0.15;
    let color = '#38bdf8';
    if (powerUp.type === 'shield') color = '#38bdf8';
    if (powerUp.type === 'slowmo') color = '#a855f7';
    if (powerUp.type === 'magnet') color = '#ec4899';
    if (powerUp.type === 'boost') color = '#f59e0b';

    // Outer Energy Ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, powerUp.radius * pulse, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Capsule Core
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, powerUp.radius * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Micro Specular Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-3, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw 3D Warp Portal
  renderWarpPortal(ctx: CanvasRenderingContext2D, portal: WarpPortal, time: number) {
    ctx.save();
    ctx.translate(portal.x, portal.y);

    for (let r = 3; r >= 1; r--) {
      const angle = time * 4 * (r % 2 === 0 ? 1 : -1);
      ctx.save();
      ctx.rotate(angle);
      ctx.strokeStyle = r === 1 ? '#f43f5e' : r === 2 ? '#ec4899' : '#8b5cf6';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, portal.radius * (r / 3), 0, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  // Draw Player Aircraft with Dual-Afterburner Flame Plumes & Dynamic Bank Tilt
  renderPlayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    velocity: number,
    skin: Skin,
    activePowerUps: ActivePowerUp[],
    time: number
  ) {
    ctx.save();
    const halfSize = BIRD_SIZE / 2;
    const centerX = x + halfSize;
    const centerY = y + halfSize;
    ctx.translate(centerX, centerY);

    // Dynamic Bank Pitch Angle
    const pitchAngle = clamp(velocity * 0.05, -0.65, 0.85);
    ctx.rotate(pitchAngle);

    // 1. Dual Afterburner Jet Plumes
    const thrusterX = -halfSize + 2;
    const flameLen = Math.max(8, 14 - velocity * 1.5) + Math.sin(time * 30) * 4;
    
    // Top & Bottom Engine Flames
    [-6, 6].forEach(offsetY => {
      const flameGrad = ctx.createLinearGradient(thrusterX, offsetY, thrusterX - flameLen, offsetY);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.3, '#38bdf8');
      flameGrad.addColorStop(0.7, '#f59e0b');
      flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(thrusterX, offsetY - 3);
      ctx.lineTo(thrusterX - flameLen, offsetY);
      ctx.lineTo(thrusterX, offsetY + 3);
      ctx.closePath();
      ctx.fill();
    });

    // 2. Active Power-Up Shield Bubble
    const hasShield = activePowerUps.some(p => p.type === 'shield');
    if (hasShield) {
      ctx.save();
      const shieldPulse = 1.0 + Math.sin(time * 8) * 0.08;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, (halfSize + 8) * shieldPulse, 0, Math.PI * 2);
      ctx.stroke();

      const shieldFill = ctx.createRadialGradient(0, 0, halfSize * 0.5, 0, 0, halfSize + 8);
      shieldFill.addColorStop(0, 'rgba(56, 189, 248, 0.05)');
      shieldFill.addColorStop(1, 'rgba(56, 189, 248, 0.22)');
      ctx.fillStyle = shieldFill;
      ctx.fill();
      ctx.restore();
    }

    // 3. Aircraft Chassis (Aerodynamic Delta Wing Fuselage)
    const bodyGrad = ctx.createLinearGradient(-halfSize, 0, halfSize, 0);
    bodyGrad.addColorStop(0, skin.colors[0]);
    bodyGrad.addColorStop(0.6, skin.colors[1] || skin.colors[0]);
    bodyGrad.addColorStop(1, skin.colors[2] || '#ffffff');

    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = skin.colors[0];
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(halfSize + 4, 0);                 // Nose cone
    ctx.lineTo(-halfSize + 4, -halfSize + 4);    // Top wingtip
    ctx.lineTo(-halfSize + 2, -3);               // Top engine mount
    ctx.lineTo(-halfSize - 2, 0);                // Rear fuselage center
    ctx.lineTo(-halfSize + 2, 3);                // Bottom engine mount
    ctx.lineTo(-halfSize + 4, halfSize - 4);     // Bottom wingtip
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Canopy Cockpit Glass with Specular Gleam
    const canopyGrad = ctx.createLinearGradient(0, -6, 6, 2);
    canopyGrad.addColorStop(0, '#38bdf8');
    canopyGrad.addColorStop(0.5, '#0284c7');
    canopyGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = canopyGrad;
    ctx.beginPath();
    ctx.ellipse(3, -1, 7, 4.5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Cockpit Specular Highlight Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(4, -3, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Translucent Ghost Pilot Telemetry
  renderGhost(ctx: CanvasRenderingContext2D, y: number, velocity: number) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.translate(65 + BIRD_SIZE / 2, y + BIRD_SIZE / 2);
    ctx.rotate(clamp(velocity * 0.05, -0.65, 0.85));

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2, 0);
    ctx.lineTo(-BIRD_SIZE / 2, -BIRD_SIZE / 2.5);
    ctx.lineTo(-BIRD_SIZE / 3, 0);
    ctx.lineTo(-BIRD_SIZE / 2, BIRD_SIZE / 2.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Draw Colossal Boss Entity (The Cyber Leviathan)
  renderBoss(ctx: CanvasRenderingContext2D, boss: BossEntity, time: number) {
    ctx.save();
    ctx.translate(boss.x, boss.y);

    const pulse = 1.0 + Math.sin(time * 6) * 0.08;

    // 1. Plasma Railgun Charge / Laser Cannon Beam
    if (boss.isFiringLaser) {
      ctx.save();
      const beamGrad = ctx.createLinearGradient(0, 0, -boss.x, 0);
      beamGrad.addColorStop(0, '#ffffff');
      beamGrad.addColorStop(0.2, '#f43f5e');
      beamGrad.addColorStop(0.8, '#e11d48');
      beamGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');

      ctx.fillStyle = beamGrad;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 24;
      ctx.fillRect(-boss.x, -14, boss.x, 28);

      // Core Laser Line
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-boss.x, -3, boss.x, 6);
      ctx.restore();
    } else if (boss.laserCharge > 0) {
      // Telegraphed Red Aiming Line
      ctx.save();
      ctx.strokeStyle = `rgba(244, 63, 94, ${boss.laserCharge * 0.9})`;
      ctx.lineWidth = 1.5 + boss.laserCharge * 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-boss.x, 0);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Segmented Dreadnought Armor Body
    const bossGrad = ctx.createLinearGradient(-30, -30, 40, 30);
    bossGrad.addColorStop(0, '#1e1b4b');
    bossGrad.addColorStop(0.5, '#4338ca');
    bossGrad.addColorStop(1, '#e879f9');

    ctx.fillStyle = bossGrad;
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(40 * pulse, 0);
    ctx.lineTo(10, -35 * pulse);
    ctx.lineTo(-35, -25);
    ctx.lineTo(-20, 0);
    ctx.lineTo(-35, 25);
    ctx.lineTo(10, 35 * pulse);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Central Glowing Cybernetic Eye
    ctx.fillStyle = boss.laserCharge > 0 ? '#f43f5e' : '#38bdf8';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, 9 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // Cinematic Post-Processing Pass: Lens Vignette & Outer Bloom
  renderPostProcessing(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.45,
      width / 2, height / 2, Math.max(width, height) * 0.75
    );
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(2, 6, 23, 0.45)');

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

export const gameRenderer = new GameRenderer();
