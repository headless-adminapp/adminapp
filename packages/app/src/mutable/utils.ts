import { useEffect, useRef, useState } from 'react';

import { MutableValue } from './type';

export function createMutableValue<T>(
  initialValue: T,
  isArray?: boolean
): MutableValue<T> {
  let storeValue = {
    current: initialValue,
  };

  type StoreListener = (state: T) => void;

  const listeners = new Set<StoreListener>();

  return {
    value: storeValue,
    setValue: (value) => {
      if (typeof value === 'function') {
        if (isArray) {
          storeValue.current = value(storeValue.current) as T;
        } else {
          storeValue.current = {
            ...storeValue.current,
            ...value(storeValue.current),
          };
        }
      } else {
        if (isArray) {
          storeValue.current = value as T;
        } else {
          storeValue.current = { ...storeValue.current, ...value };
        }
      }

      listeners.forEach((listener) => listener(storeValue.current));
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
