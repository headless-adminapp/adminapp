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

const useSizeStyles = makeStyles({
  small: {
    minHeight: extendedTokens.controlMinHeightS,
  },
  medium: {
    minHeight: extendedTokens.controlMinHeightM,
  },
  large: {
    minHeight: extendedTokens.controlMinHeightL,
  },
});

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
    const sizeStyles = useSizeStyles();
    return (
      <DropdownInternal
        {...rest}
        className={mergeClasses(
          styles.root,
          sizeStyles[rest.size || 'medium'],
          (rest.appearance === 'outline' || !rest.appearance) &&
            styles.outlined,
          className
        )}
        ref={ref}
        listbox={{
          className: styles.listbox,
        }}
      />
    );
  }
);
