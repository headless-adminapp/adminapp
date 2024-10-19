import { AlertDialogOptions } from '@headless-adminapp/core/experience/dialog';
import { useCallback } from 'react';

import { useOpenDialog } from './useOpenDialog';

export function useOpenErrorDialog() {
  const openDialog = useOpenDialog();

  const openErrorDialog = useCallback(
    (options: Omit<AlertDialogOptions, 'type' | 'onConfirm' | 'onClose'>) => {
      const { close } = openDialog({
        type: 'error',
        ...options,
        onDismiss: () => {
          close();
        },
        onConfirm: () => {
          close();
        },
      });
    },
    [openDialog]
  );

  return openErrorDialog;
}
