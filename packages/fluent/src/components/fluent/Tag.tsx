import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  Tag as TagInternal,
  TagProps,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
  },
});

type ExtendedTagProps = TagProps;

export const Tag: ForwardRefComponent<ExtendedTagProps> = forwardRef(
  function Tag({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <TagInternal
        {...rest}
        className={mergeClasses(styles.root, className)}
        ref={ref}
      />
    );
  }
);
