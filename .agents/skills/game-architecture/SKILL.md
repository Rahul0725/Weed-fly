---
name: game-architecture
description: >-
  Expert architectural guide for modern game development including Entity Component System (ECS),
  fixed timestep game loops, physics integration, finite state machines, spatial hashing, and memory pooling.
---

# Game Architecture & Systems Design

This skill provides comprehensive architectural patterns and production-ready implementations for modern game engines, web games, and real-time simulations.

## 1. Core Architectural Paradigms

### Entity Component System (ECS)
ECS decouples game data from logic, allowing high cache locality, modular composition, and flexible game behaviors.

- **Entity**: An integer ID representing an in-game object.
- **Component**: Pure data struct (e.g., `Transform`, `Velocity`, `Health`, `Sprite`).
- **System**: Pure logic that iterates over entities matching a specific component signature (e.g., `MovementSystem`, `RenderSystem`, `CollisionSystem`).

```typescript
// Compact Type-Safe TypeScript ECS Implementation
export type Entity = number;

export class ECSWorld {
  private nextEntityId = 1;
  private components = new Map<string, Map<Entity, any>>();

  createEntity(): Entity {
    return this.nextEntityId++;
  }

  addComponent<T>(entity: Entity, componentName: string, data: T): void {
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map());
    }
    this.components.get(componentName)!.set(entity, data);
  }

  getComponent<T>(entity: Entity, componentName: string): T | undefined {
    return this.components.get(componentName)?.get(entity);
  }

  query(...componentNames: string[]): Entity[] {
    const sets = componentNames.map(name => this.components.get(name) || new Map());
    if (sets.length === 0) return [];
    const [first, ...rest] = sets;
    const result: Entity[] = [];
    for (const entity of first.keys()) {
      if (rest.every(s => s.has(entity))) {
        result.push(entity);
      }
    }
    return result;
  }
}
```

## 2. Deterministic Fixed-Timestep Game Loop

Never tie physics or game logic directly to variable frame rates (`requestAnimationFrame` delta). Always use an accumulator with a fixed physics timestep (e.g., 60Hz = 1/60s).

```typescript
export class GameLoop {
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedStep = 1 / 60; // 60 FPS physics

  constructor(
    private updatePhysics: (dt: number) => void,
    private render: (interpolation: number) => void
  ) {}

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.step.bind(this));
  }

  private step(currentTime: number) {
    let frameTime = (currentTime - this.lastTime) / 1000;
    if (frameTime > 0.25) frameTime = 0.25; // Spiral of death clamp
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= this.fixedStep) {
      this.updatePhysics(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }

    const alpha = this.accumulator / this.fixedStep; // Interpolation factor for smooth rendering
    this.render(alpha);
    requestAnimationFrame(this.step.bind(this));
  }
}
```

## 3. Spatial Partitioning (Spatial Hashing)

For 2D collision detection with hundreds or thousands of entities, brute-force $O(N^2)$ checks will drop frame rates. Use a Spatial Hash Grid:

```typescript
export class SpatialHashGrid {
  private grid = new Map<string, Set<Entity>>();

  constructor(private cellSize: number) {}

  private key(x: number, y: number): string {
    return `${Math.floor(x / this.cellSize)}:${Math.floor(y / this.cellSize)}`;
  }

  insert(entity: Entity, x: number, y: number, w: number, h: number) {
    const minX = Math.floor(x / this.cellSize);
    const maxX = Math.floor((x + w) / this.cellSize);
    const minY = Math.floor(y / this.cellSize);
    const maxY = Math.floor((y + h) / this.cellSize);

    for (let gx = minX; gx <= maxX; gx++) {
      for (let gy = minY; gy <= maxY; gy++) {
        const k = `${gx}:${gy}`;
        if (!this.grid.has(k)) this.grid.set(k, new Set());
        this.grid.get(k)!.add(entity);
      }
    }
  }

  query(x: number, y: number, w: number, h: number): Set<Entity> {
    const candidates = new Set<Entity>();
    const minX = Math.floor(x / this.cellSize);
    const maxX = Math.floor((x + w) / this.cellSize);
    const minY = Math.floor(y / this.cellSize);
    const maxY = Math.floor((y + h) / this.cellSize);

    for (let gx = minX; gx <= maxX; gx++) {
      for (let gy = minY; gy <= maxY; gy++) {
        const set = this.grid.get(`${gx}:${gy}`);
        if (set) set.forEach(e => candidates.add(e));
      }
    }
    return candidates;
  }

  clear() {
    this.grid.clear();
  }
}
```
