import { PromptDialogOptions } from '@headless-adminapp/core/experience/dialog';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { useCallback } from 'react';

import { useOpenDialog } from './useOpenDialog';

export function useOpenPromptDialog() {
  const openDialog = useOpenDialog();

  const openPromptDialog = useCallback(
    <SA extends SchemaAttributes = SchemaAttributes>(
      options: Omit<
        PromptDialogOptions<SA>,
        'type' | 'onConfirm' | 'onClose' | 'onCancel'
      >
    ) => {
      return new Promise<InferredSchemaType<SA> | null>((resolve) => {
        const { close } = openDialog({
          type: 'prompt',
          ...options,
          onDismiss: () => {
            if (!options.allowDismiss) {
              return;
            }
            close();
            resolve(null);
          },
          onConfirm: (result) => {
            close();
            resolve(result as InferredSchemaType<SA>);
          },
          onCancel: () => {
            close();
            resolve(null);
          },
        });
      });
    },
    [openDialog]
  );

  return openPromptDialog;
}
