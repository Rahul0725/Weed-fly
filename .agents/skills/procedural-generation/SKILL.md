---
name: procedural-generation
description: >-
  Algorithms and recipes for Procedural Content Generation (PCG) in games: Wave Function Collapse (WFC),
  Binary Space Partitioning (BSP) dungeons, Cellular Automata caves, Perlin/Simplex noise terrain, and Voronoi biomes.
---

# Procedural Content Generation (PCG) Guide

Procedural generation allows creating infinite, reproducible, and varied worlds, levels, items, and dungeons using mathematical algorithms.

---

## 1. Wave Function Collapse (WFC) - 2D Tile Constraints

Wave Function Collapse selects tiles with lowest entropy and propagates adjacency rules:

```typescript
export interface Tile {
  id: string;
  allowedNeighbors: { up: string[]; down: string[]; left: string[]; right: string[] };
}

export class WaveFunctionCollapse2D {
  private grid: string[][][]; // Possible tile IDs per cell

  constructor(private width: number, private height: number, private tiles: Tile[]) {
    const allIds = tiles.map(t => t.id);
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => [...allIds])
    );
  }

  collapse(): string[][] | null {
    while (true) {
      // Find cell with lowest non-zero entropy (fewest possibilities > 1)
      let minEntropy = Infinity;
      let targetX = -1, targetY = -1;

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const len = this.grid[y][x].length;
          if (len > 1 && len < minEntropy) {
            minEntropy = len;
            targetX = x;
            targetY = y;
          }
        }
      }

      if (targetX === -1) break; // All cells collapsed!

      // Pick random choice from available
      const options = this.grid[targetY][targetX];
      const picked = options[Math.floor(Math.random() * options.length)];
      this.grid[targetY][targetX] = [picked];

      // Propagate constraints
      this.propagate(targetX, targetY);
    }

    return this.grid.map(row => row.map(cell => cell[0] || 'void'));
  }

  private propagate(startX: number, startY: number) {
    const queue = [[startX, startY]];
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const currentPossibilities = this.grid[y][x];

      const neighbors = [
        { dx: 0, dy: -1, dir: 'up', opp: 'down' },
        { dx: 0, dy: 1, dir: 'down', opp: 'up' },
        { dx: -1, dy: 0, dir: 'left', opp: 'right' },
        { dx: 1, dy: 0, dir: 'right', opp: 'left' },
      ];

      for (const n of neighbors) {
        const nx = x + n.dx, ny = y + n.dy;
        if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;

        const allowedNext = new Set<string>();
        for (const tileId of currentPossibilities) {
          const tileDef = this.tiles.find(t => t.id === tileId);
          if (tileDef) {
            (tileDef.allowedNeighbors as any)[n.dir].forEach((id: string) => allowedNext.add(id));
          }
        }

        const prevLen = this.grid[ny][nx].length;
        this.grid[ny][nx] = this.grid[ny][nx].filter(id => allowedNext.has(id));
        if (this.grid[ny][nx].length < prevLen) {
          queue.push([nx, ny]);
        }
      }
    }
  }
}
```

---

## 2. Cellular Automata for Cave Generation (4-5 Rule)

1. Fill grid randomly with 45% wall probability.
2. Run 4-5 iterations where cell becomes a Wall if $\ge 5$ neighboring walls within 1 step radius, otherwise Floor.

```typescript
export function generateCave(width: number, height: number, iterations = 4): number[][] {
  let map = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => (Math.random() < 0.45 ? 1 : 0))
  );

  for (let iter = 0; iter < iterations; iter++) {
    const next = Array.from({ length: height }, () => Array(width).fill(1));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let walls = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny < 0 || ny >= height || nx < 0 || nx >= width || map[ny][nx] === 1) {
              walls++;
            }
          }
        }
        next[y][x] = walls >= 5 ? 1 : 0;
      }
    }
    map = next;
  }
  return map;
}
```
