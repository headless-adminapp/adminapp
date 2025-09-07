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
});

type ExtendedButtonProps = ButtonProps;

export const Button: ForwardRefComponent<ExtendedButtonProps> = forwardRef(
  function Button({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <ButtonInternal
        {...rest}
        className={mergeClasses(className, styles.root)}
        ref={ref}
      />
    );
  }
);
