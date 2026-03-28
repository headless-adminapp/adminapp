import {
  Combobox as ComboboxInternal,
  ComboboxProps,
  ForwardRefComponent,
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

type ExtendedComboboxProps = ComboboxProps;

export const Combobox: ForwardRefComponent<ExtendedComboboxProps> = forwardRef(
  function Combobox({ className, ...rest }, ref) {
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
  },
);
