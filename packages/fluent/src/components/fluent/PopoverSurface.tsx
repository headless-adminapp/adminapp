import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  PopoverSurface as PopoverSurfaceInternal,
  PopoverSurfaceProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.paperBorderRadius,
  },
});

type ExtendedPopoverSurfaceProps = PopoverSurfaceProps;

export const PopoverSurface: ForwardRefComponent<ExtendedPopoverSurfaceProps> =
  forwardRef(function PopoverSurface({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <PopoverSurfaceInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  });
