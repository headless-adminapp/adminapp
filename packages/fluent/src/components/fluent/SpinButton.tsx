import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  SpinButton as SpinButtonInternal,
  SpinButtonProps,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    minHeight: extendedTokens.controlMinHeightM,
  },
  readonly: {
    '&::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
    '&:focus-within:active::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
  },
});

type ExtendedSpinButtonProps = SpinButtonProps;

export const SpinButton: ForwardRefComponent<ExtendedSpinButtonProps> =
  forwardRef(function SpinButton({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <SpinButtonInternal
        {...rest}
        className={mergeClasses(
          styles.root,
          rest.readOnly && styles.readonly,
          className,
        )}
        ref={ref}
      />
    );
  });
