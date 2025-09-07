import {
  ForwardRefComponent,
  makeStyles,
  MenuPopover as MenuPopoverInternal,
  MenuPopoverProps,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightRegular,
    borderRadius: extendedTokens.paperBorderRadius,
  },
});

type ExtendedMenuPopoverProps = MenuPopoverProps;

export const MenuPopover: ForwardRefComponent<ExtendedMenuPopoverProps> =
  forwardRef(function MenuPopover({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <MenuPopoverInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  });
