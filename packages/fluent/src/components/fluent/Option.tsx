import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  Option as OptionInternal,
  OptionProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    paddingBlock: extendedTokens.optionPaddingVertical,
  },
});

type ExtendedOptionProps = OptionProps;

export const Option: ForwardRefComponent<ExtendedOptionProps> = forwardRef(
  function Option({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <OptionInternal
        {...rest}
        className={mergeClasses(className, styles.root)}
        ref={ref}
      />
    );
  }
);
