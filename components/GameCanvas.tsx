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
  const requestRef = useRef<number>(0);
  const birdImageRef = useRef<HTMLImageElement | null>(null);
  const pipeImageRef = useRef<HTMLImageElement | null>(null);
  
  // Game State Refs (Mutable for performance)
  const birdY = useRef(dimensions.height / 2);
  const birdVelocity = useRef(0);
  const pipes = useRef<PipeData[]>([]);
  const frameCount = useRef(0);
  
  // Logic Refs for loop stability
  const scoreRef = useRef(0);
  const framesSinceSpawn = useRef(PIPE_SPAWN_RATE); 

  // Handle Resize with Debounce/Update
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gameState === GameState.START) {
      birdY.current = dimensions.height / 2;
    }
  }, [dimensions, gameState]);

  // Load Images and Audio
  useEffect(() => {
    const birdImg = new Image();
    birdImg.crossOrigin = "anonymous";
    birdImg.src = BIRD_IMAGE_URL;
    birdImg.onload = () => {
      birdImageRef.current = birdImg;
    };

    const pipeImg = new Image();
    pipeImg.crossOrigin = "anonymous";
    pipeImg.src = PIPE_IMAGE_URL;
    pipeImg.onload = () => {
      pipeImageRef.current = pipeImg;
    };

    // Preload background music
    audioController.preloadMusic(BACKGROUND_MUSIC_URL);
  }, []);

  const drawBird = (ctx: CanvasRenderingContext2D, y: number, velocity: number) => {
    ctx.save();
    const cx = 50 + BIRD_SIZE / 2;
    const cy = y + BIRD_SIZE / 2;
    
    ctx.translate(cx, cy);
    const rotation = Math.min(Math.max(velocity * 5, -25), 90) * (Math.PI / 180);
    ctx.rotate(rotation);
    
    if (birdImageRef.current) {
        const visualSize = BIRD_SIZE * 1.2; 
        
        // Create circular clipping mask
        ctx.beginPath();
        ctx.arc(0, 0, visualSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(birdImageRef.current, -visualSize/2, -visualSize/2, visualSize, visualSize);
        
        // Optional: Add a slight border to make it pop against background
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

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
    const bottomY = topH + pipe.gap;
    const bottomH = gameHeight - bottomY;

    if (pipeImageRef.current) {
      const img = pipeImageRef.current;
      
      // Calculate scaled height to maintain aspect ratio
      // This ensures the image isn't squashed horizontally
      const scale = PIPE_WIDTH / img.width;
      const tileHeight = img.height * scale;

      // --- Draw Top Pipe ---
      ctx.save();
      // Translate to the bottom of the top pipe (the opening)
      ctx.translate(x, topH);
      // Flip vertically so we draw 'upwards' from the opening.
      // This ensures the "cap" of the pipe (if at image y=0) is at the opening.
      ctx.scale(1, -1);
      
      // Clip to the pipe's dimensions
      ctx.beginPath();
      ctx.rect(0, 0, PIPE_WIDTH, topH);
      ctx.clip();

      // Loop to tile (chain) the image
      let currentY = 0;
      while (currentY < topH) {
        ctx.drawImage(img, 0, currentY, PIPE_WIDTH, tileHeight);
        currentY += tileHeight;
      }
      ctx.restore();

      // --- Draw Bottom Pipe ---
      ctx.save();
      // Translate to the top of the bottom pipe (the opening)
      ctx.translate(x, bottomY);
      
      // Clip to the pipe's dimensions
      ctx.beginPath();
      ctx.rect(0, 0, PIPE_WIDTH, bottomH);
      ctx.clip();

      // Loop to tile (chain) the image downwards
      currentY = 0;
      while (currentY < bottomH) {
        ctx.drawImage(img, 0, currentY, PIPE_WIDTH, tileHeight);
        currentY += tileHeight;
      }
      ctx.restore();
      
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
    framesSinceSpawn.current = PIPE_SPAWN_RATE;
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
  }, [gameState, dimensions.height]);

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

    // HIGH DPI SCALING
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    const desiredWidth = rect.width * dpr;
    const desiredHeight = rect.height * dpr;

    if (canvas.width !== desiredWidth || canvas.height !== desiredHeight) {
        canvas.width = desiredWidth;
        canvas.height = desiredHeight;
        ctx.scale(dpr, dpr);
    } else {
        // Reset transform to identity * dpr for start of frame
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Enable high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Use logical dimensions for logic
    const { width, height } = dimensions;

    // Clear Logic Space
    ctx.clearRect(0, 0, width, height);

    if (gameState === GameState.PLAYING) {
      // Physics Updates
      birdVelocity.current += GRAVITY;
      birdY.current += birdVelocity.current;

      const currentScore = scoreRef.current;
      
      const currentSpeed = Math.min(PIPE_SPEED + (currentScore * 0.08), 7.0); 
      const currentSpawnRate = Math.max(PIPE_SPAWN_RATE - (currentScore * 1.2), 60);

      // Pipe Spawning
      if (framesSinceSpawn.current >= currentSpawnRate) {
        const minPipeHeight = 50;
        const groundHeight = 48; 
        
        const dynamicGap = Math.max(130, PIPE_GAP - (currentScore * 1.4));
        const maxPipeHeight = height - dynamicGap - minPipeHeight - groundHeight;
        const safeMax = Math.max(minPipeHeight + 10, maxPipeHeight);
        const randomHeight = Math.floor(Math.random() * (safeMax - minPipeHeight + 1)) + minPipeHeight;
        
        pipes.current.push({
          id: Date.now(),
          x: width,
          topHeight: randomHeight,
          gap: dynamicGap,
          passed: false,
        });
        
        framesSinceSpawn.current = 0;
      }
      framesSinceSpawn.current++;

      // Pipe Logic
      for (let i = pipes.current.length - 1; i >= 0; i--) {
        const pipe = pipes.current[i];
        pipe.x -= currentSpeed;

        const hitBoxSize = BIRD_SIZE - 8;
        const birdLeft = 50 + 4;
        const birdRight = 50 + hitBoxSize;
        const birdTop = birdY.current + 4;
        const birdBottom = birdY.current + hitBoxSize;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + pipe.gap) {
             triggerGameOver(scoreRef.current); 
          }
        }

        if (!pipe.passed && birdLeft > pipeRight) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            audioController.playScore();
        }

        if (pipe.x + PIPE_WIDTH < -50) {
            pipes.current.splice(i, 1);
        }
      }

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
  }, [gameState, triggerGameOver, dimensions]); 
  
  // Re-bind loop
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
        if (target.tagName !== 'BUTTON' && target.tagName !== 'A') {
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
      
      <div className="relative w-full h-full bg-sky-300 overflow-hidden">
        {/* Background Clouds */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-24 h-12 bg-white rounded-full blur-md"></div>
            <div className="absolute top-[20%] right-[10%] w-36 h-16 bg-white rounded-full blur-lg"></div>
            <div className="absolute bottom-[30%] left-[30%] w-48 h-20 bg-white rounded-full blur-xl"></div>
        </div>

        {/* Canvas Layer with explicit CSS dimensions for DPI scaling */}
        <canvas 
            ref={canvasRef}
            style={{ width: '100%', height: '100%' }}
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
                <p className="text-slate-400 text-sm mt-3 font-medium">
                  Developer: <a href="https://t.me/Its_Gods" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">@Its_Gods</a>
                </p>
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