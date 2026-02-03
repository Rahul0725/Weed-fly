import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GRAVITY, 
  JUMP_STRENGTH, 
  PIPE_SPEED, 
  PIPE_SPAWN_RATE, 
  BIRD_SIZE, 
  PIPE_WIDTH, 
  PIPE_GAP, 
  GameState,
  BIRD_IMAGE_URL,
  PIPE_IMAGE_URL,
  BACKGROUND_MUSIC_URL
} from '../constants';
import { PipeData } from '../types';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { audioController } from '../utils/audio';

const GameCanvas: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const birdImageRef = useRef<HTMLImageElement | null>(null);
  const pipeImageRef = useRef<HTMLImageElement | null>(null);
  
  // Game State Refs (Mutable for performance)
  const birdY = useRef(dimensions.height / 2);
  const birdVelocity = useRef(0);
  const pipes = useRef<PipeData[]>([]);
  const frameCount = useRef(0);
  
  // Logic Refs for loop stability
  const scoreRef = useRef(0);
  const framesSinceSpawn = useRef(PIPE_SPAWN_RATE); // Start ready to spawn

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update refs when dimensions change to prevent glitches
  useEffect(() => {
    // If bird is off screen due to resize, reset or clamp? 
    // For now, we just let it be, but during Start screen, center it.
    if (gameState === GameState.START) {
      birdY.current = dimensions.height / 2;
    }
  }, [dimensions, gameState]);

  // Load Images
  useEffect(() => {
    // Load Bird
    const birdImg = new Image();
    birdImg.crossOrigin = "anonymous";
    birdImg.src = BIRD_IMAGE_URL;
    birdImg.onload = () => {
      birdImageRef.current = birdImg;
    };

    // Load Pipe
    const pipeImg = new Image();
    pipeImg.crossOrigin = "anonymous";
    pipeImg.src = PIPE_IMAGE_URL;
    pipeImg.onload = () => {
      pipeImageRef.current = pipeImg;
    };
  }, []);

  const drawBird = (ctx: CanvasRenderingContext2D, y: number, velocity: number) => {
    ctx.save();
    // Center bird horizontally based on screen width (e.g., 10% or fixed 50px)
    // We'll keep it fixed at 50px from left for consistency
    const cx = 50 + BIRD_SIZE / 2;
    const cy = y + BIRD_SIZE / 2;
    
    ctx.translate(cx, cy);
    const rotation = Math.min(Math.max(velocity * 5, -25), 90) * (Math.PI / 180);
    ctx.rotate(rotation);
    
    if (birdImageRef.current) {
        const visualSize = BIRD_SIZE * 1.2; 
        ctx.drawImage(birdImageRef.current, -visualSize/2, -visualSize/2, visualSize, visualSize);
    } else {
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(0, 0, BIRD_SIZE/2, 0, Math.PI*2);
        ctx.fill();
    }

    ctx.restore();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, pipe: PipeData, gameHeight: number) => {
    const x = pipe.x;
    const topH = pipe.topHeight;
    const bottomY = topH + PIPE_GAP;
    const bottomH = gameHeight - bottomY;

    if (pipeImageRef.current) {
      // Draw Top Pipe
      // Flip vertically so the "top" of the image is at the pipe opening
      ctx.save();
      ctx.translate(x, topH); // Move to bottom of top pipe
      ctx.scale(1, -1); // Flip vertically
      // Draw from 0 to topH (which is now upwards because of flip)
      ctx.drawImage(pipeImageRef.current, 0, 0, PIPE_WIDTH, topH);
      ctx.restore();

      // Draw Bottom Pipe
      // "Top" of the image is at the pipe opening
      ctx.drawImage(pipeImageRef.current, x, bottomY, PIPE_WIDTH, bottomH);
      
    } else {
      // Fallback Rendering
      ctx.fillStyle = '#22C55E';
      ctx.strokeStyle = '#166534';
      ctx.lineWidth = 3;

      ctx.fillRect(x, 0, PIPE_WIDTH, topH);
      ctx.strokeRect(x, -2, PIPE_WIDTH, topH + 2);
      
      ctx.fillRect(x, bottomY, PIPE_WIDTH, bottomH);
      ctx.strokeRect(x, bottomY, PIPE_WIDTH, bottomH + 2);
    }
  };

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('flappy-leaf-highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    audioController.resume();
    audioController.playMusic(BACKGROUND_MUSIC_URL);
    birdY.current = dimensions.height / 2;
    birdVelocity.current = 0;
    pipes.current = [];
    frameCount.current = 0;
    scoreRef.current = 0;
    framesSinceSpawn.current = PIPE_SPAWN_RATE; // Trigger immediate spawn
    setScore(0);
    setGameState(GameState.PLAYING);
  };

  const jump = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      birdVelocity.current = JUMP_STRENGTH;
      audioController.playJump();
    } else if (gameState === GameState.START) {
      startGame();
    }
  }, [gameState, dimensions.height]); // Add dimensions dependency

  const triggerGameOver = useCallback((finalScore: number) => {
    setGameState(GameState.GAME_OVER);
    audioController.playCrash();
    audioController.stopMusic();
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('flappy-leaf-highscore', finalScore.toString());
    }
  }, [highScore]);

  // Main Game Loop
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use current dimensions from state (captured in closure)
    const { width, height } = dimensions;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    if (gameState === GameState.PLAYING) {
      // Physics Updates
      birdVelocity.current += GRAVITY;
      birdY.current += birdVelocity.current;

      // Dynamic Difficulty
      const currentScore = scoreRef.current;
      // Increase speed by 0.04 per point, capped at 7.0 (Base 3.5)
      const currentSpeed = Math.min(PIPE_SPEED + (currentScore * 0.04), 7.0); 
      // Decrease spawn rate by 0.8 per point, floor at 50 frames (Base 100)
      const currentSpawnRate = Math.max(PIPE_SPAWN_RATE - (currentScore * 0.8), 50);

      // Pipe Spawning
      // We check if it's time to spawn based on dynamic rate
      if (framesSinceSpawn.current >= currentSpawnRate) {
        const minPipeHeight = 50;
        const groundHeight = 48; // h-12 is 48px
        const maxPipeHeight = height - PIPE_GAP - minPipeHeight - groundHeight;
        
        // Ensure we have valid spawn range
        const safeMax = Math.max(minPipeHeight + 10, maxPipeHeight);
        const randomHeight = Math.floor(Math.random() * (safeMax - minPipeHeight + 1)) + minPipeHeight;
        
        pipes.current.push({
          id: Date.now(),
          x: width,
          topHeight: randomHeight,
          passed: false,
        });
        
        framesSinceSpawn.current = 0;
      }
      framesSinceSpawn.current++;

      // Pipe Logic
      for (let i = pipes.current.length - 1; i >= 0; i--) {
        const pipe = pipes.current[i];
        pipe.x -= currentSpeed;

        // Collision Logic
        const hitBoxSize = BIRD_SIZE - 8;
        const birdLeft = 50 + 4;
        const birdRight = 50 + hitBoxSize;
        const birdTop = birdY.current + 4;
        const birdBottom = birdY.current + hitBoxSize;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
             triggerGameOver(scoreRef.current); 
          }
        }

        // Score
        if (!pipe.passed && birdLeft > pipeRight) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            audioController.playScore();
        }

        // Cleanup
        if (pipe.x + PIPE_WIDTH < -50) {
            pipes.current.splice(i, 1);
        }
      }

      // Ground/Ceiling Collision
      // Ground is h-12 (48px)
      const groundY = height - 48;
      if (birdY.current + BIRD_SIZE >= groundY || birdY.current <= 0) {
          triggerGameOver(scoreRef.current);
      }

      frameCount.current++;
    }

    // Render Entities
    pipes.current.forEach(pipe => drawPipe(ctx, pipe, height));
    drawBird(ctx, birdY.current, birdVelocity.current);

    if (gameState === GameState.PLAYING) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [gameState, triggerGameOver, dimensions]); // score removed from dependencies
  
  // Re-bind loop when state changes
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, loop]);

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'BUTTON') {
             e.preventDefault();
             jump();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [jump]);

  return (
    <div className="relative w-full h-full bg-slate-900 select-none touch-none overflow-hidden">
      
      {/* Game Container - Now Full Screen */}
      <div 
        className="relative w-full h-full bg-sky-300 overflow-hidden"
      >
        {/* Background Clouds */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-24 h-12 bg-white rounded-full blur-md"></div>
            <div className="absolute top-[20%] right-[10%] w-36 h-16 bg-white rounded-full blur-lg"></div>
            <div className="absolute bottom-[30%] left-[30%] w-48 h-20 bg-white rounded-full blur-xl"></div>
        </div>

        {/* Canvas Layer */}
        <canvas 
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 z-20 block"
        />

        {/* Ground Strip */}
        <div className="absolute bottom-0 w-full h-12 bg-[#ded895] border-t-4 border-[#73bf2e] z-30">
             <div className="w-full h-full opacity-50 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#d0c874_10px,#d0c874_20px)]"></div>
        </div>

        {/* Score HUD */}
        {gameState === GameState.PLAYING && (
          <div className="absolute top-10 w-full text-center z-40 pointer-events-none">
            <span className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] stroke-black tracking-tighter">
              {score}
            </span>
          </div>
        )}

        {/* Start Screen */}
        {gameState === GameState.START && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-[90%] animate-bounce-slow flex flex-col gap-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">FLAPPY WEED</h1>
                <p className="text-slate-500">Tap, Click, or Space to fly high</p>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-3 px-8 rounded-full shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto w-full"
              >
                <Play fill="currentColor" /> START
              </button>

            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-2xl shadow-2xl text-center w-[90%] max-w-sm border-4 border-slate-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-slate-800 mb-1">GAME OVER</h2>
                
                <div className="flex justify-center gap-4 mt-4">
                  <div className="bg-orange-100 p-3 rounded-xl flex-1 border-2 border-orange-200">
                    <p className="text-xs uppercase font-bold text-orange-500 tracking-wider">Score</p>
                    <p className="text-3xl font-black text-slate-800">{score}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-xl flex-1 border-2 border-yellow-200">
                     <p className="text-xs uppercase font-bold text-yellow-600 tracking-wider flex items-center justify-center gap-1">
                       <Trophy size={12} /> Best
                     </p>
                    <p className="text-3xl font-black text-slate-800">{highScore}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-3 px-6 rounded-xl shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw /> PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCanvas;