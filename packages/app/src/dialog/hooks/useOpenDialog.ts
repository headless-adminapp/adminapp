import { DialogOptions } from '@headless-adminapp/core/experience/dialog';
import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { useContextSetValue } from '../../mutable/context';
import { DialogContext, DialogItemState } from '../context';
import { useCloseDialog } from './useCloseDialog';

/**
 * @zero-deps
 */
export function useOpenDialog() {
  const setValue = useContextSetValue(DialogContext);
  const closeDialog = useCloseDialog();

  const openDialog = useCallback(
    (options: DialogOptions) => {
      const id = uuid();

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
