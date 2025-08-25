import { useCallback } from 'react';

import { useContextSetValue } from '../../mutable/context';
import { DialogContext, DialogItemState } from '../context';

function markDialogAsClosed(items: DialogItemState[], id: string) {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, isOpen: false };
    }

    return item;
  });
}

function excludeDialogItemById(items: DialogItemState[], id: string) {
  return items.filter((item) => item.id !== id);
}

/**
 * @zero-deps
 */
export function useCloseDialog() {
  const setValue = useContextSetValue(DialogContext);

  const closeDialog = useCallback(
    (id: string) => {
      setValue((state) => ({
        items: markDialogAsClosed(state.items, id),
      }));

      // Simulate a delay to show the dialog closing animation
      setTimeout(() => {
        setValue((state) => ({
          items: excludeDialogItemById(state.items, id),
        }));
      }, 1000);
    },
    [setValue]
  );

  return closeDialog;
}
