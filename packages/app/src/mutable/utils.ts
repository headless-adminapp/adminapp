import { useEffect, useRef, useState } from 'react';

import { MutableValue } from './type';

export function createMutableValue<T>(
  initialValue: T | (() => T),
  isArray?: boolean
): MutableValue<T> {
  let storeValue = {
    current:
      typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue,
  };

  type StoreListener = (newState: T, prevState: T, changes: Partial<T>) => void;

  const listeners = new Set<StoreListener>();

  return {
    value: storeValue,
    setValue: (value) => {
      if (typeof value === 'function') {
        value = value(storeValue.current);
      }

      const prevState = storeValue.current;

      if (isArray) {
        storeValue.current = value as T;
      } else {
        storeValue.current = { ...storeValue.current, ...value };
      }

      listeners.forEach((listener) =>
        listener(storeValue.current, prevState, value)
      );
    },
    listeners,
    addListener: (listener) => listeners.add(listener),
    removeListener: (listener) => listeners.delete(listener),
  };
}

export function useMutableValueSelector<T, R>(
  mutableValue: MutableValue<T>,
  selector: (state: T) => R
) {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [value, setValue] = useState({
    innerValue: selectorRef.current(mutableValue.value.current),
  });

  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const listener = (state: T) => {
      const newValue = selectorRef.current(state);
      if (newValue !== valueRef.current.innerValue) {
        setValue({
          innerValue: newValue,
        });
      }
    };

    mutableValue.addListener(listener);

    // Trigger value which update while adding listener
    listener(mutableValue.value.current);

    return () => {
      mutableValue.removeListener(listener);
    };
  }, [mutableValue]);

  return value.innerValue;
}
