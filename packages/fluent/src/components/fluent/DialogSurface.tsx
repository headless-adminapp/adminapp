import {
  DialogSurface as DialogSurfaceInternal,
  type DialogSurfaceProps,
  makeStyles,
  mergeClasses,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.dialogBorderRadius,
  },
});

type ExtendedDialogSurfaceProps = DialogSurfaceProps & {
  ref?: Ref<HTMLDivElement>;
};

export const DialogSurface: FC<ExtendedDialogSurfaceProps> =
  function DialogSurface({ className, ref, ...rest }) {
    const styles = useStyles();
    return (
      <DialogSurfaceInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  };
