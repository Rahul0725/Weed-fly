export const GRAVITY = 0.6;
export const JUMP_STRENGTH = -10; // Stronger jump for snappier response
export const PIPE_SPEED = 3.0; // Slower start speed (was 3.5)
export const PIPE_WIDTH = 60; 
export const PIPE_GAP = 190; // Wider gap for easier start (was 160)
export const PIPE_SPAWN_RATE = 120; // Slower spawn rate for easier start (was 100)
export const BIRD_SIZE = 40; 
export const GAME_HEIGHT = 600;
export const GAME_WIDTH = 400;

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

// Custom Bird Image URL
export const BIRD_IMAGE_URL = 'https://i.postimg.cc/W3pZrt95/Flag-of-Israel-svg.png';

// Custom Pillar Image URL
export const PIPE_IMAGE_URL = 'https://i.postimg.cc/jSFd96pH/IMG-20260203-150942.jpg';

// Background Music URL
export const BACKGROUND_MUSIC_URL = 'https://github.com/Rahul0725/Sound-effects-gg/raw/refs/heads/main/Bangla%20funny%20video%20bangala%20gala%20gali%20dog%20and%20chita%F0%9F%A4%A3%F0%9F%A4%A3%F0%9F%A4%A3(MP3_160K).mp3';

// Game Over Sound URL 1 (Default)
export const GAME_OVER_SOUND_URL = 'https://github.com/Rahul0725/Sound-effects-gg/raw/refs/heads/main/92116289-98e0-4dea-babc-e6f7f8bd08d9.mp3';

// Game Over Sound URL 2 (Second Attempt)
export const GAME_OVER_SOUND