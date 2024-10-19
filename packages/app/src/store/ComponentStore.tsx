import { IComponentStore } from '@headless-adminapp/core/store';

export class ComponentStore implements IComponentStore {
  private components: Record<string, unknown> = {};

  public registerComponent<T>(name: string, component: T): void {
    this.components[name] = component;
  }

  public resolveComponent<T>(name: string): T {
    const self = this;
    return function (props: any) {
      if (!self.components[name]) {
        throw new Error(`Component ${name} is not registered`);
      }

      const Component = self.components[name] as any;

      return <Component {...props} />;
    } as T;
  }
}
