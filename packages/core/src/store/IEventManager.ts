export interface IEventManager {
  on<T>(key: string, handler: T): void;
  off<T>(key: string, handler: T): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(key: string, ...args: any[]): any[];
}
