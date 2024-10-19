import { useContextSelector } from '../../mutable/context';
import { DialogContext } from '../context';

export function useDialogItem(id: string) {
  return useContextSelector(DialogContext, (state) =>
    state.items.find((item) => item.id === id)
  );
}
