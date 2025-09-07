import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  SpinButton as SpinButtonInternal,
  SpinButtonProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    minHeight: extendedTokens.controlMinHeightM,
  },
});

type ExtendedSpinButtonProps = SpinButtonProps;

export const SpinButton: ForwardRefComponent<ExtendedSpinButtonProps> =
  forwardRef(function SpinButton({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <SpinButtonInternal
        {...rest}
        className={mergeClasses(className, styles.root)}
        ref={ref}
      />
    );
  });
