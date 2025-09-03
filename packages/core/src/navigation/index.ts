interface NavigateOptions {
  state?: any;
}

export type GuardFn = () => boolean | Promise<boolean>;

export interface RouterInstance {
  back: () => Promise<void>;
  forward: () => Promise<void>;
  push(href: string, options?: NavigateOptions): Promise<void>;
  replace(href: string, options?: NavigateOptions): Promise<void>;
  prefetch(href: string): void;
  setState(state: any): void;
  setState(key: string, state: any): void;
  getState<T = any>(): T;
  getState<T = any>(key: string): T | undefined;
  registerGuard(fn: GuardFn): void;
  unregisterGuard(fn: GuardFn): void;
}
