import {
  ConfirmDialogOptions,
  ConfirmResult,
} from '@headless-adminapp/core/experience/dialog';
import { useCallback } from 'react';

import { useOpenDialog } from './useOpenDialog';

export function useOpenConfirmDialog() {
  const openDialog = useOpenDialog();

  const openConfirmDialog = useCallback(
    (
      options: Omit<
        ConfirmDialogOptions,
        'type' | 'onConfirm' | 'onDismiss' | 'onCancel'
      >
    ) => {
      return new Promise<ConfirmResult | null>((resolve) => {
        const { close } = openDialog({
          type: 'confirm',
          ...options,
          onDismiss: () => {
            if (!options.allowDismiss) {
              return;
            }
            close();
            resolve(null);
          },
          onConfirm: () => {
            close();
            resolve({ confirmed: true });
          },
          onCancel: () => {
            close();
            resolve({ confirmed: false });
          },
        });
      });
    },
    [openDialog]
  );

  return openConfirmDialog;
}
