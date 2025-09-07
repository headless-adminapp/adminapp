import {
  Combobox as ComboboxInternal,
  ComboboxProps,
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
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
});

type ExtendedComboboxProps = ComboboxProps;

export const Combobox: ForwardRefComponent<ExtendedComboboxProps> = forwardRef(
  function Combobox({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <ComboboxInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
        listbox={{
          className: styles.listbox,
        }}
      />
    );
  }
);
