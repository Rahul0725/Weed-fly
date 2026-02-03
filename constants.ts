export const GRAVITY = 0.6;
export const JUMP_STRENGTH = -10; // Stronger jump for snappier response
export const PIPE_SPEED = 3.5; // Slightly faster
export const PIPE_WIDTH = 60; // Slightly wider for the joint visual
export const PIPE_GAP = 160; // Slightly tighter gap
export const PIPE_SPAWN_RATE = 100; // Frames between pipes
export const BIRD_SIZE = 40; // Slightly larger for the leaf detail
export const GAME_HEIGHT = 600;
export const GAME_WIDTH = 400;

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

// Custom Bird Image URL
export const BIRD_IMAGE_URL = 'https://i.postimg.cc/3rVkV17b/c73724cd89f40fceed434287e55ce6a3.jpg';

// Custom Pillar Image URL
export const PIPE_IMAGE_URL = 'https://i.postimg.cc/jSFd96pH/IMG-20260203-150942.jpg';

// Background Music URL
export const BACKGROUND_MUSIC_URL = 'https://collection.cloudinary.com/dwlquotvw/6a15e083ddef2b94042e60de676b199b';