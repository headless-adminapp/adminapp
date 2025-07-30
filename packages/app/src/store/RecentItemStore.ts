import { Id } from '@headless-adminapp/core';
import { safeLocalStorage } from '../utils/localStorage';

export interface IRecentItemStore {
  getItems: <T = unknown>(cacheKey: string, limit?: number) => RecentItem<T>[];
  addItem: <T = unknown>(
    cacheKey: string,
    id: Id,
    value: T,
    limit?: number
  ) => void;
  addListener: (
    cacheKey: string,
    listener: (items: RecentItem<unknown>[]) => void
  ) => void;
  removeListener: (
    cacheKey: string,
    listener: (items: RecentItem<unknown>[]) => void
  ) => void;
}

export type RecentItem<T> = {
  timestamp: number;
  id: Id;
  value: T;
};

export class RecentItemStore implements IRecentItemStore {
  private data: Record<string, RecentItem<unknown>[]> = {};
  private readonly storageKey = 'recent_items';
  private readonly maxItems = 5;
  private listeners: Record<
    string,
    Array<(items: RecentItem<unknown>[]) => void>
  > = {};
  private readonly localStorage: Storage = safeLocalStorage;

  constructor() {
    this.init();
  }

  private init() {
    const _data = this.localStorage.getItem(this.storageKey);

    if (_data) {
      this.data = JSON.parse(_data) as Record<string, RecentItem<unknown>[]>;
    } else {
      this.data = {};
    }
  }

  private sync() {
    this.localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  getItems<T = unknown>(cacheKey: string, limit?: number): RecentItem<T>[] {
    if (!this.data[cacheKey]) {
      return [];
    }

    if (limit) {
      return this.data[cacheKey].slice(0, limit) as RecentItem<T>[];
    }

    return this.data[cacheKey] as RecentItem<T>[];
  }

  addItem<T = unknown>(
    cacheKey: string,
    id: Id,
    value: T,
    limit?: number
  ): void {
    if (!this.data[cacheKey]) {
      this.data[cacheKey] = [];
    }

    const timestamp = Date.now();

    if (this.data[cacheKey].some((item) => item.id === id)) {
      // Remove existing item with the same ID
      this.data[cacheKey] = this.data[cacheKey].filter(
        (item) => item.id !== id
      );
    }

    const newItem: RecentItem<T> = { timestamp, id, value };
    this.data[cacheKey].unshift(newItem);
    this.data[cacheKey] = this.data[cacheKey].slice(0, limit ?? this.maxItems); // Limit to max items
    this.sync();

    for (const listener of this.listeners[cacheKey] || []) {
      listener(this.data[cacheKey]);
    }
  }

  addListener(
    cacheKey: string,
    listener: (items: RecentItem<unknown>[]) => void
  ) {
    if (!this.listeners[cacheKey]) {
      this.listeners[cacheKey] = [];
    }

    this.listeners[cacheKey].push(listener);
  }

  removeListener(
    cacheKey: string,
    listener: (items: RecentItem<unknown>[]) => void
  ) {
    if (!this.listeners[cacheKey]) {
      return;
    }

    this.listeners[cacheKey] = this.listeners[cacheKey].filter(
      (l) => l !== listener
    );
  }
}
