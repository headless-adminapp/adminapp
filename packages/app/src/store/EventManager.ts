import { IEventManager } from '@headless-adminapp/core/store';

type EventHandler = (...args: any[]) => any | Promise<any>;

export class EventManager implements IEventManager {
  private handlers: Record<string, unknown[]> = {};

  public on<T>(key: string, handler: T): void {
    if (!this.handlers[key]) {
      this.handlers[key] = [];
    }

    this.handlers[key].push(handler);
  }

  public off<T>(key: string, handler: T): void {
    if (!this.handlers[key]) {
      return;
    }

    this.handlers[key] = this.handlers[key].filter((h) => h !== handler);

    if (this.handlers[key].length === 0) {
      delete this.handlers[key];
    }
  }

  public emit(key: string, ...args: any[]): any[] {
    const handlers = (this.handlers[key] ?? []) as EventHandler[];

    return handlers.map((handler) => handler(...args));
  }
}
