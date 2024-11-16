import { IComponentStore } from '@headless-adminapp/core/store';

export class ComponentStore implements IComponentStore {
  private components: Record<string, unknown> = {};

  public registerComponent<T>(name: string, component: T): void {
    this.components[name] = component;
  }

  public getComponent<T>(name: string): T | null {
    const self = this;
    return function (props: any) {
      if (!self.components[name]) {
        return null;
      }

      const Component = self.components[name] as any;

      return <Component {...props} />;
    } as T;
  }
}
