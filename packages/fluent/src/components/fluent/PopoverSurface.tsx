import {
  makeStyles,
  mergeClasses,
  PopoverSurface as PopoverSurfaceInternal,
  type PopoverSurfaceProps,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.paperBorderRadius,
  },
});

type ExtendedPopoverSurfaceProps = PopoverSurfaceProps & {
  ref?: Ref<HTMLDivElement>;
};

export const PopoverSurface: FC<ExtendedPopoverSurfaceProps> =
  function PopoverSurface({ className, ref, ...rest }) {
    const styles = useStyles();
    return (
      <PopoverSurfaceInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  };
