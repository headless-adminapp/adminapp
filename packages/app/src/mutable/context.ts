import {
  createContext as createReactContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { MutableValue } from './type';
import { createMutableValue, useMutableValueSelector } from './utils';

export type ContextValue<T> = MutableValue<T>;
const createContextValue = createMutableValue;
export const useContextSelectorInternal = useMutableValueSelector;

export function createContext<T>() {
  const context = createReactContext<ContextValue<T>>(null as any);
  return context;
}

export function useCreateContextStore<T>(initialValue: T) {
  const [state] = useState(() => createContextValue(initialValue));
  return state;
}

export function useContextSelector<T, R>(
  context: React.Context<ContextValue<T>>,
  selector: (state: T) => R
) {
  const contextValue = useContext(context);

  if (!contextValue) {
    throw new Error('useContextSelector must be used within a Provider');
  }

  return useContextSelectorInternal(contextValue, selector);
}

export function useContextSetValue<T>(context: React.Context<ContextValue<T>>) {
  const contextValue = useContext(context);

  if (!contextValue) {
    throw new Error('useContextSetValue must be used within a Provider');
  }

  return contextValue.setValue;
}

type Setter<T, U extends unknown[]> = (
  setValue: ContextValue<T>['setValue']
) => (...args: U) => void;

export function useContextValueSetter<T, U extends unknown[]>(
  context: React.Context<ContextValue<T>>,
  setter: Setter<T, U>
) {
  const contextValue = useContext(context);

  if (!contextValue) {
    throw new Error('useContextValueSetter must be used within a Provider');
  }

  const setterRef = useRef(setter);
  setterRef.current = setter;

  const setterWrapper = useCallback(
    (...args: U) => {
      return setterRef.current(contextValue.setValue)(...args);
    },
    [contextValue.setValue]
  );

  return setterWrapper;
}
