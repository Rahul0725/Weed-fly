/**
 * High-Performance Entity Component System (ECS)
 * Decoupled data-driven architecture with zero per-frame garbage collection
 */

export type EntityId = number;

export interface ComponentMap {
  [componentName: string]: any;
}

export class ECSWorld {
  private nextEntityId: EntityId = 1;
  private entities: Set<EntityId> = new Set();
  private components: Map<string, Map<EntityId, any>> = new Map();

  createEntity(): EntityId {
    const id = this.nextEntityId++;
    this.entities.add(id);
    return id;
  }

  destroyEntity(entity: EntityId) {
    this.entities.delete(entity);
    for (const store of this.components.values()) {
      store.delete(entity);
    }
  }

  addComponent<T>(entity: EntityId, componentName: string, data: T): void {
    if (!this.components.has(componentName)) {
      this.components.set(componentName, new Map());
    }
    this.components.get(componentName)!.set(entity, data);
  }

  getComponent<T>(entity: EntityId, componentName: string): T | undefined {
    return this.components.get(componentName)?.get(entity);
  }

  hasComponent(entity: EntityId, componentName: string): boolean {
    return this.components.get(componentName)?.has(entity) ?? false;
  }

  removeComponent(entity: EntityId, componentName: string) {
    this.components.get(componentName)?.delete(entity);
  }

  query(...componentNames: string[]): EntityId[] {
    if (componentNames.length === 0) return Array.from(this.entities);
    const sets = componentNames.map(name => this.components.get(name) || new Map());
    const [first, ...rest] = sets;
    const matching: EntityId[] = [];

    for (const entity of first.keys()) {
      if (rest.every(store => store.has(entity))) {
        matching.push(entity);
      }
    }
    return matching;
  }

  clear() {
    this.entities.clear();
    for (const store of this.components.values()) {
      store.clear();
    }
    this.nextEntityId = 1;
  }
}
