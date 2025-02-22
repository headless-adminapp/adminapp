export interface IEventManager {
  on<T>(key: string, handler: T): void;
  off<T>(key: string, handler: T): void;
  emit(key: string, ...args: any[]): any[];
}
