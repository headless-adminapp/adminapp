import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  MessageBar as MessageBarInternal,
  MessageBarProps,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightRegular,
    borderRadius: extendedTokens.controlBorderRadius,
  },
});

type ExtendedMessageBarProps = MessageBarProps;

export const MessageBar: ForwardRefComponent<ExtendedMessageBarProps> =
  forwardRef(function MessageBar({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <MessageBarInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  });
