import { Dispatch, SetStateAction, useCallback, useState } from 'react';

function getStorageValue<S>(key: string, store: Storage): S | undefined {
  const value = store.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return undefined;
}

function setStorageValue<S>(key: string, value: S, store: Storage): void {
  store.setItem(key, JSON.stringify(value));
}

export function useStorageState<S = undefined>(
  initialState: S,
  key: string,
  store: Storage = localStorage
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(
    getStorageValue(key, store) ?? initialState
  );

  const setStoredState: Dispatch<SetStateAction<S>> = useCallback(
    (value) => {
      setState((prevState) => {
        const finalState = value instanceof Function ? value(prevState) : value;
        setStorageValue(key, finalState, store);
        return finalState;
      });
    },
    [key, store]
  );

  return [state, setStoredState];
}
