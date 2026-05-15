import {
  makeStyles,
  MenuPopover as MenuPopoverInternal,
  type MenuPopoverProps,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightRegular,
    borderRadius: extendedTokens.paperBorderRadius,
  },
});

type ExtendedMenuPopoverProps = MenuPopoverProps & {
  ref?: Ref<HTMLDivElement>;
};

export const MenuPopover: FC<ExtendedMenuPopoverProps> = function MenuPopover({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <MenuPopoverInternal
      {...rest}
      className={mergeClasses(styles.root, className)}
      ref={ref}
    />
  );
};
