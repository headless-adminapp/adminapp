import { useContextSelector } from '../../mutable/context';
import { DialogContext } from '../context';

export function useDialogItems() {
  return useContextSelector(DialogContext, (state) => state.items);
}
