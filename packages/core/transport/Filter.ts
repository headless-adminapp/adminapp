import type { Condition } from './Condition';

export type Filter<T extends string = string> = {
  type: 'and' | 'or';
} & (
  | {
      conditions?: Condition<T>[];
      filters: [Filter<T>, ...Filter<T>[]];
    }
  | {
      conditions: Condition[];
      filters?: [Filter<T>, ...Filter<T>[]];
    }
);
