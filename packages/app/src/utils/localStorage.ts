function getLocalStorage(): Storage | undefined {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return undefined;
}

export const safeLocalStorage: Storage = {
  clear: () => {
    getLocalStorage()?.clear();
  },
  get length(): number {
    return getLocalStorage()?.length || 0;
  },
  getItem: (key: string): string | null => {
    return getLocalStorage()?.getItem(key) || null;
  },
  setItem: (key: string, value: string): void => {
    getLocalStorage()?.setItem(key, value);
  },
  removeItem: (key: string): void => {
    getLocalStorage()?.removeItem(key);
  },
  key: (index: number): string | null => {
    return getLocalStorage()?.key(index) || null;
  },
};
