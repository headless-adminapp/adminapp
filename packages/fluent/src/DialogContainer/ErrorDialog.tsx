import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  tokens,
} from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';

interface ErrorDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  confirmText?: string;
}

export function ErrorDialog(props: ErrorDialogProps) {
  return (
    <Dialog
      open={props.open}
      onOpenChange={() => {
        props.onDismiss?.();
      }}
    >
      <DialogSurface style={{ maxWidth: 480 }}>
        <DialogBody>
          <DialogTitle style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                color: tokens.colorPaletteRedForeground1,
                // marginBottom: tokens.spacingVerticalL,
                display: 'inline-flex',
                alignItems: 'center',
                marginRight: tokens.spacingHorizontalS,
              }}
            >
              <Icons.Error />
            </span>
            {props.title || 'Error'}
          </DialogTitle>
          <DialogContent>{props.message}</DialogContent>
          <DialogActions>
            <Button
              appearance="primary"
              style={{ background: tokens.colorPaletteRedBackground3 }}
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
