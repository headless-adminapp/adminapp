import {
  ForwardRefComponent,
  makeStyles,
  MenuItem as MenuItemInternal,
  MenuItemProps,
  mergeClasses,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.buttonBorderRadius,
    paddingBlock: extendedTokens.menuItemPaddingVertical,
  },
});

type ExtendedMenuItemProps = MenuItemProps;

export const MenuItem: ForwardRefComponent<ExtendedMenuItemProps> = forwardRef(
  function MenuItem({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <MenuItemInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  }
);
