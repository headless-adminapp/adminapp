import { DialogOptions } from '@headless-adminapp/core/experience/dialog';
import { useCallback } from 'react';

import { useContextSetValue } from '../../mutable/context';
import { DialogContext, DialogItemState } from '../context';
import { useCloseDialog } from './useCloseDialog';

function randomId() {
  return Math.random().toString(36).substring(2);
}

export function useOpenDialog() {
  const setValue = useContextSetValue(DialogContext);
  const closeDialog = useCloseDialog();

  const openDialog = useCallback(
    (options: DialogOptions) => {
      const id = randomId();

      setValue((state) => {
        return {
          items: [
            ...state.items,
            {
              id,
              isOpen: true,
              ...options,
            } as DialogItemState,
          ],
        };
      });

      return { id, close: () => closeDialog(id) };
    },
    [setValue, closeDialog]
  );

  return openDialog;
}
