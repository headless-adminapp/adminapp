import { AlertDialogOptions } from '@headless-adminapp/core/experience/dialog';
import { useCallback } from 'react';

import { useOpenDialog } from './useOpenDialog';

export function useOpenAlertDialog() {
  const openDialog = useOpenDialog();

  const openAlertDialog = useCallback(
    (options: Omit<AlertDialogOptions, 'type' | 'onConfirm' | 'onClose'>) => {
      return new Promise<void>((resolve) => {
        const { close } = openDialog({
          type: 'alert',
          ...options,
          onDismiss: () => {
            close();
            resolve();
          },
          onConfirm: () => {
            close();
            resolve();
          },
        });
      });
    },
    [openDialog]
  );

  return openAlertDialog;
}
