import {
  Checkbox as CheckboxInternal,
  CheckboxProps,
  ForwardRefComponent,
  makeStyles,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  indicator: {
    borderRadius: extendedTokens.checkboxBorderRadius,
  },
});

type ExtendedCheckboxProps = CheckboxProps;

export const Checkbox: ForwardRefComponent<ExtendedCheckboxProps> = forwardRef(
  function Checkbox({ ...rest }, ref) {
    const styles = useStyles();
    return (
      <CheckboxInternal
        {...rest}
        ref={ref}
        indicator={{
          className: styles.indicator,
        }}
      />
    );
  }
);
