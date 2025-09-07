import {
  Dropdown as DropdownInternal,
  DropdownProps,
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
    '&::after': {
      borderBottomLeftRadius: extendedTokens.controlBorderRadius,
      borderBottomRightRadius: extendedTokens.controlBorderRadius,
      left: extendedTokens.controlBottomBorderMargin,
      right: extendedTokens.controlBottomBorderMargin,
    },
  },
  listbox: {
    borderRadius: extendedTokens.paperBorderRadius,
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

type ExtendedDropdownProps = DropdownProps;

export const Dropdown: ForwardRefComponent<ExtendedDropdownProps> = forwardRef(
  function Dropdown({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <DropdownInternal
        {...rest}
        className={mergeClasses(
          className,
          styles.root,
          (rest.appearance === 'outline' || !rest.appearance) && styles.outlined
        )}
        ref={ref}
        // open
        // onOpenChange={() => {}}
        listbox={{
          className: styles.listbox,
        }}
      />
    );
  }
);
