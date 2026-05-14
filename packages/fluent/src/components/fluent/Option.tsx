import {
  type ForwardRefComponent,
  makeStyles,
  mergeClasses,
  Option as OptionInternal,
  type OptionProps,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    padding: `${extendedTokens.optionPaddingVertical} ${tokens.spacingHorizontalS}`,
  },
});

type ExtendedOptionProps = OptionProps;

export const Option: ForwardRefComponent<ExtendedOptionProps> = forwardRef(
  function Option({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <OptionInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  },
);
