import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogTitle,
  tokens,
} from '@fluentui/react-components';
import { stringWithDefault } from '@headless-adminapp/core/utils';
import { Icons } from '@headless-adminapp/icons';

import { Button, DialogSurface } from '../components/fluent';

interface ErrorDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onDismiss?: () => void;
  confirmText?: string;
}

export function ErrorDialog(props: Readonly<ErrorDialogProps>) {
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
            {stringWithDefault(props.title, 'Error')}
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
