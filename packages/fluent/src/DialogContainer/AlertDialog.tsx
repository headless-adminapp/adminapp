import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
} from '@fluentui/react-components';

interface AlertDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  confirmText?: string;
}

export function AlertDialog(props: AlertDialogProps) {
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
              appearance="primary"
              onClick={() => {
                props.onConfirm?.();
              }}
            >
              {props.confirmText ?? 'Close'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
