import { IComponentStore } from '@headless-adminapp/core/store';

export class ComponentStore implements IComponentStore {
  private components: Record<string, unknown> = {};

  public registerComponent<T>(name: string, component: T): void {
    this.components[name] = component;
  }

  public getComponent<T>(name: string): T | null {
    const self = this;
    if (!self.components[name]) {
      return null;
    }

    return self.components[name] as T;
  }
}
