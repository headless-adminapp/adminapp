export interface IComponentStore {
  registerComponent: <T>(name: string, component: T) => void;
  getComponent: <T>(name: string) => T | null;
}
