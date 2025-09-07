import {
  DialogSurface as DialogSurfaceInternal,
  DialogSurfaceProps,
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.dialogBorderRadius,
  },
});

type ExtendedDialogSurfaceProps = DialogSurfaceProps;

export const DialogSurface: ForwardRefComponent<ExtendedDialogSurfaceProps> =
  forwardRef(function DialogSurface({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <DialogSurfaceInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  });
