export interface IComponentStore {
  registerComponent: <T>(name: string, component: T) => void;
  resolveComponent: <T>(name: string) => T;
}
