import {
  Button as ButtonInternal,
  ButtonProps,
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightRegular,
    borderRadius: extendedTokens.buttonBorderRadius,
  },
  small: {
    minHeight: extendedTokens.buttonMinHeightS,
    '&[data-icon-only="true"]': {
      minWidth: extendedTokens.buttonMinHeightS,
      maxWidth: extendedTokens.buttonMinHeightS,
    },
  },
  medium: {
    minHeight: extendedTokens.buttonMinHeightM,
    '&[data-icon-only="true"]': {
      minWidth: extendedTokens.buttonMinHeightM,
      maxWidth: extendedTokens.buttonMinHeightM,
    },
  },
  large: {
    minHeight: extendedTokens.buttonMinHeightL,
    '&[data-icon-only="true"]': {
      minWidth: extendedTokens.buttonMinHeightL,
      maxWidth: extendedTokens.buttonMinHeightL,
    },
  },
});

type ExtendedButtonProps = ButtonProps;

export const Button: ForwardRefComponent<ExtendedButtonProps> = forwardRef(
  function Button({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <ButtonInternal
        {...rest}
        className={mergeClasses(
          styles.root,
          styles[rest.size || 'medium'],
          className
        )}
        data-icon-only={!rest.children && !!rest.icon ? 'true' : undefined}
        ref={ref}
      />
    );
  }
);
