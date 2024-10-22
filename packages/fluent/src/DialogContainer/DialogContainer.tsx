import { useDialogItems } from '@headless-adminapp/app/dialog/hooks';

import { AlertDialog } from './AlertDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { ErrorDialog } from './ErrorDialog';
import { PromptDialog } from './PromptDialog';

export const DialogContainer = () => {
  const items = useDialogItems();

  return (
    <>
      {items.map((item) => {
        const { id, isOpen, ...options } = item;

        switch (options.type) {
          case 'alert':
            return (
              <AlertDialog
                key={id}
                message={options.text}
                open={isOpen}
                confirmText={options.confirmButtonLabel}
                onConfirm={options.onConfirm}
                onDismiss={options.onDismiss}
                title={options.title}
              />
            );
          case 'confirm':
            return (
              <ConfirmDialog
                key={id}
                message={options.text}
                title={options.title}
                onCancel={options.onCancel}
                onConfirm={options.onConfirm}
                onDismiss={options.onDismiss}
                open={isOpen}
                cancelText={options.cancelButtonLabel}
                confirmText={options.confirmButtonLabel}
              />
            );
          case 'error':
            return (
              <ErrorDialog
                key={id}
                message={options.text}
                open={isOpen}
                confirmText={options.confirmButtonLabel}
                onConfirm={options.onConfirm}
                onDismiss={options.onDismiss}
                title={options.title}
              />
            );
          case 'prompt':
            return (
              <PromptDialog
                key={id}
                attributes={options.attributes}
                // cancelButtonLabel={options.cancelButtonLabel}
                // confirmButtonLabel={options.confirmButtonLabel}
                defaultValues={options.defaultValues}
                onCancel={options.onCancel}
                onDismiss={options.onDismiss}
                onConfirm={options.onConfirm}
                text={options.text}
                title={options.title}
                open={isOpen}
                cancelText={options.cancelButtonLabel}
                confirmText={options.confirmButtonLabel}
              />
            );
          case 'custom':
            return (
              <options.Component
                key={id}
                id={id}
                isOpen={isOpen}
                {...options.props}
              />
            );
        }

        return null;
      })}
    </>
  );
};
