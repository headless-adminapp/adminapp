import {
  makeStyles,
  MenuItem as MenuItemInternal,
  type MenuItemProps,
  mergeClasses,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.buttonBorderRadius,
    paddingBlock: extendedTokens.menuItemPaddingVertical,
  },
});

type ExtendedMenuItemProps = MenuItemProps & {
  ref?: Ref<HTMLDivElement>;
};

export const MenuItem: FC<ExtendedMenuItemProps> = function MenuItem({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <MenuItemInternal
      {...rest}
      className={mergeClasses(styles.root, className)}
      ref={ref}
    />
  );
};
