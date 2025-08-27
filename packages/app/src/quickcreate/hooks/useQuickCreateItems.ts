import { useContextSelector } from '../../mutable/context';
import { QuickCreateContext } from '../context';

export function useQuickCreateItems() {
  return useContextSelector(QuickCreateContext, (state) => state.items);
}
