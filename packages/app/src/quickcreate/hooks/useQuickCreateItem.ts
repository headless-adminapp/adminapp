import { useContextSelector } from '../../mutable/context';
import { QuickCreateContext } from '../context';

export function useQuickCreateItem(id: string) {
  return useContextSelector(QuickCreateContext, (state) =>
    state.items.find((item) => item.id === id)
  );
}
