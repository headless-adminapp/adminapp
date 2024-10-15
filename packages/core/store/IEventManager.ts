export interface IEventManager {
  on<T>(key: string, handler: T): Promise<void>;
  off<T>(key: string, handler: T): Promise<void>;
  emit(key: string, ...args: any[]): any[];
}
