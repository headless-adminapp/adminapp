import {
  type ButtonProps,
  makeStyles,
  mergeClasses,
  tokens,
  ToolbarButton as ToolbarButtonInternal,
  type ToolbarButtonProps,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightRegular,
    borderRadius: extendedTokens.buttonBorderRadius,
    minHeight: extendedTokens.buttonMinHeightM,
    '&[data-icon-only="true"]': {
      minWidth: extendedTokens.buttonMinHeightM,
      maxWidth: extendedTokens.buttonMinHeightM,
    },
  },
});

type ExtendedToolbarButtonProps = ToolbarButtonProps & {
  iconPosition?: ButtonProps['iconPosition'];
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
};

export const ToolbarButton: FC<ExtendedToolbarButtonProps> =
  function ToolbarButton({ className, ref, ...rest }) {
    const styles = useStyles();
    return (
      <ToolbarButtonInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        data-icon-only={!rest.children && !!rest.icon ? 'true' : undefined}
        ref={ref}
      />
    );
  };
