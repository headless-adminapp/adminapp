import {
  Combobox as ComboboxInternal,
  type ComboboxProps,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    minHeight: extendedTokens.controlMinHeightM,
  },
  listbox: {
    borderRadius: extendedTokens.paperBorderRadius,
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

type ExtendedComboboxProps = ComboboxProps & {
  ref?: Ref<HTMLInputElement>;
};

export const Combobox: FC<ExtendedComboboxProps> = function Combobox({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <ComboboxInternal
      {...rest}
      className={mergeClasses(
        styles.root,
        rest.readOnly && styles.readonly,
        className,
      )}
      ref={ref}
      listbox={{
        className: styles.listbox,
      }}
    />
  );
};
