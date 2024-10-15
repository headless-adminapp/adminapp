import type { OperatorKey } from './OperatorKey';

export type Condition<T extends string = string> = {
  field: T;
  extendedKey?: string;
  operator: OperatorKey;
  value: any;
};
