import {
  ButtonProps,
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  tokens,
  ToolbarButton as ToolbarButtonInternal,
  ToolbarButtonProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

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
};

export const ToolbarButton: ForwardRefComponent<ExtendedToolbarButtonProps> =
  forwardRef(function ToolbarButton({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <ToolbarButtonInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        data-icon-only={!rest.children && !!rest.icon ? 'true' : undefined}
        ref={ref}
      />
    );
  });
