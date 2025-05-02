import type { Condition } from './Condition';

export type Filter<T extends string = string> = {
  type: 'and' | 'or';
} & (
  | {
      conditions?: [Condition<T>, ...Condition<T>[]];
      filters: [Filter<T>, ...Filter<T>[]];
    }
  | {
      conditions: [Condition<T>, ...Condition<T>[]];
      filters?: [Filter<T>, ...Filter<T>[]];
    }
);
