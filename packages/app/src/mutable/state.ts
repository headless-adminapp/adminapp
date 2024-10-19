import { useState } from 'react';

import { MutableValue } from './type';
import { createMutableValue, useMutableValueSelector } from './utils';

export type MutableState<T> = MutableValue<T>;
export const createMutableState = createMutableValue;
export const useMutableStateSelector = useMutableValueSelector;

export function useMutableState<T>(initialValue: T, isArray?: boolean) {
  const [state] = useState(() => createMutableState(initialValue, isArray));
  return state;
}
