import {
  makeStyles,
  mergeClasses,
  Textarea as TextareaInternal,
  type TextareaProps,
  tokens,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

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

type ExtendedTextareaProps = TextareaProps & {
  ref?: Ref<HTMLTextAreaElement>;
};

export const Textarea: FC<ExtendedTextareaProps> = function Textarea({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <TextareaInternal
      {...rest}
      className={mergeClasses(
        styles.root,
        rest.readOnly && styles.readonly,
        className,
      )}
      ref={ref}
    />
  );
};
