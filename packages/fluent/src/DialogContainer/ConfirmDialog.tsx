import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@fluentui/react-components';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onDismiss?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog(props: Readonly<ConfirmDialogProps>) {
  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.onDismiss?.();
      }}
    >
      <DialogSurface style={{ maxWidth: 480 }}>
        <DialogBody>
          {!!props.title && <DialogTitle>{props.title}</DialogTitle>}
          <DialogContent>{props.message}</DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                props.onCancel?.();
              }}
            >
              {props.cancelText ?? 'Cancel'}
            </Button>
            <Button
              appearance="primary"
              onClick={() => {
                props.onConfirm?.();
              }}
            >
              {props.confirmText ?? 'Confirm'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
