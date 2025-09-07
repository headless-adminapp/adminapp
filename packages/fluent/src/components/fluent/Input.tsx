import {
  ForwardRefComponent,
  Input as InputInternal,
  InputProps,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    minHeight: extendedTokens.controlMinHeightM,
    '&::after': {
      borderBottomLeftRadius: extendedTokens.controlBorderRadius,
      borderBottomRightRadius: extendedTokens.controlBorderRadius,
      left: extendedTokens.controlBottomBorderMargin,
      right: extendedTokens.controlBottomBorderMargin,
    },
  },
  readonly: {
    '&::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
    '&:focus-within:active::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
  },
  outlined: {
    borderBottomColor: tokens.colorNeutralStroke1,

    '&:hover': {
      borderBottomColor: tokens.colorNeutralStroke1Hover,
    },

    '&:active': {
      borderBottomColor: tokens.colorNeutralStroke1Pressed,
    },
    '&:focus-within': {
      borderBottomColor: tokens.colorNeutralStroke1Pressed,
    },
  },
});

type ExtendedInputProps = InputProps;

export const Input: ForwardRefComponent<ExtendedInputProps> = forwardRef(
  function Input({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <InputInternal
        {...rest}
        className={mergeClasses(
          styles.root,
          rest.readOnly && styles.readonly,
          (rest.appearance === 'outline' || !rest.appearance) &&
            styles.outlined,
          className
        )}
        ref={ref}
      />
    );
  }
);
