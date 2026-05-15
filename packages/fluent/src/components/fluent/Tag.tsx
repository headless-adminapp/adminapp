import {
  makeStyles,
  mergeClasses,
  Tag as TagInternal,
  type TagProps,
} from '@fluentui/react-components';
import type { FC, Ref } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
  },
});

type ExtendedTagProps = TagProps & {
  ref?: Ref<HTMLDivElement>;
};

export const Tag: FC<ExtendedTagProps> = function Tag({
  className,
  ref,
  ...rest
}) {
  const styles = useStyles();
  return (
    <TagInternal
      {...rest}
      className={mergeClasses(styles.root, className)}
      ref={ref}
    />
  );
};
