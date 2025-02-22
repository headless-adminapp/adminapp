import { useContextSelector } from '../../mutable/context';
import { DataFormContext } from '../context';

export function useContextKey(): number {
  return useContextSelector(DataFormContext, (state) => state.contextKey);
}
