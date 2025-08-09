import { useContextSelector } from '../../mutable';
import { HeaderContext, HeaderStoreState } from '../context';

function getLastValue<T>(data: T[]): T | null {
  if (!data.length) return null;

  return data[data.length - 1];
}

export function useHeaderValue<T>(field: keyof HeaderStoreState): T | null {
  const value = useContextSelector(
    HeaderContext,
    (state) => getLastValue(state[field])?.value ?? null
  );

  return value as unknown as T;
}
