import type { OperatorKey } from './OperatorKey';

export type Condition<T extends string = string> = {
  field: T;
  extendedKey?: string;
  operator: OperatorKey;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};
