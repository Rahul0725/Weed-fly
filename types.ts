export interface PipeData {
  id: number;
  x: number;
  topHeight: number;
  gap: number;
  passed: boolean;
  imgIndex: number;
}

export interface GameStats {
  score: number;
  highScore: number;
}