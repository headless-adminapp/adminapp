import {
  makeStyles,
  mergeClasses,
  Option as OptionInternal,
  type OptionProps,
  tokens,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    padding: `${extendedTokens.optionPaddingVertical} ${tokens.spacingHorizontalS}`,
  },
});

type ExtendedOptionProps = OptionProps & {
  ref?: Ref<HTMLDivElement>;
};

export const Option: FC<ExtendedOptionProps> = function Option({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <OptionInternal
      {...rest}
      className={mergeClasses(styles.root, className)}
      ref={ref}
    />
  );
};
