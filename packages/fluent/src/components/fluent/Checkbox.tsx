import {
  Checkbox as CheckboxInternal,
  type CheckboxProps,
  makeStyles,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  indicator: {
    borderRadius: extendedTokens.checkboxBorderRadius,
  },
});

type ExtendedCheckboxProps = CheckboxProps & {
  ref?: Ref<HTMLInputElement>;
};

export const Checkbox: FC<ExtendedCheckboxProps> = function Checkbox({
  ref,
  ...rest
}) {
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
};
