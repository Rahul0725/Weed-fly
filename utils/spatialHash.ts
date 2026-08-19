/**
 * 2D Spatial Hash Grid for O(1) broadphase collision and graze detection
 */

export class SpatialHashGrid<T> {
  private grid: Map<string, Set<T>> = new Map();

  constructor(private cellSize: number = 64) {}

  private key(x: number, y: number): string {
    return `${Math.floor(x / this.cellSize)}:${Math.floor(y / this.cellSize)}`;
  }

  insert(item: T, x: number, y: number, w: number, h: number) {
    const minX = Math.floor(x / this.cellSize);
    const maxX = Math.floor((x + w) / this.cellSize);
    const minY = Math.floor(y / this.cellSize);
    const maxY = Math.floor((y + h) / this.cellSize);

    for (let gx = minX; gx <= maxX; gx++) {
      for (let gy = minY; gy <= maxY; gy++) {
        const k = `${gx}:${gy}`;
        if (!this.grid.has(k)) this.grid.set(k, new Set());
        this.grid.get(k)!.add(item);
      }
    }
  }

  query(x: number, y: number, w: number, h: number): Set<T> {
    const candidates = new Set<T>();
    const minX = Math.floor(x / this.cellSize);
    const maxX = Math.floor((x + w) / this.cellSize);
    const minY = Math.floor(y / this.cellSize);
    const maxY = Math.floor((y + h) / this.cellSize);

    for (let gx = minX; gx <= maxX; gx++) {
      for (let gy = minY; gy <= maxY; gy++) {
        const k = `${gx}:${gy}`;
        const cell = this.grid.get(k);
        if (cell) {
          cell.forEach(item => candidates.add(item));
        }
      }
    }
    return candidates;
  }

  clear() {
    this.grid.clear();
  }
}
