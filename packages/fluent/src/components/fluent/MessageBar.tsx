import {
  makeStyles,
  mergeClasses,
  MessageBar as MessageBarInternal,
  type MessageBarProps,
  tokens,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    fontWeight: tokens.fontWeightRegular,
    borderRadius: extendedTokens.controlBorderRadius,
  },
});

type ExtendedMessageBarProps = MessageBarProps & {
  ref?: Ref<HTMLDivElement>;
};

export const MessageBar: FC<ExtendedMessageBarProps> = function MessageBar({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <MessageBarInternal
      {...rest}
      className={mergeClasses(styles.root, className)}
      ref={ref}
    />
  );
};
