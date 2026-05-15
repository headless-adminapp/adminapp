import {
  makeStyles,
  mergeClasses,
  SpinButton as SpinButtonInternal,
  type SpinButtonProps,
  tokens,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

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

type ExtendedSpinButtonProps = SpinButtonProps & {
  ref?: Ref<HTMLInputElement>;
};

export const SpinButton: FC<ExtendedSpinButtonProps> = function SpinButton({
  className,
  ref,
  ...rest
}) {
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
};
