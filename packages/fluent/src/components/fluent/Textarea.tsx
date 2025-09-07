import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  Textarea as TextareaInternal,
  TextareaProps,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
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
});

type ExtendedTextareaProps = TextareaProps;

export const Textarea: ForwardRefComponent<ExtendedTextareaProps> = forwardRef(
  function Textarea({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <TextareaInternal
        {...rest}
        className={mergeClasses(
          styles.root,
          rest.readOnly && styles.readonly,
          className
        )}
        ref={ref}
      />
    );
  }
);
