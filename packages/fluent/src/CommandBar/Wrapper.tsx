import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  Toolbar,
} from '@fluentui/react-components';
import { forwardRef, PropsWithChildren, RefObject } from 'react';

const useStyles = makeStyles({
  root: {
    flexWrap: 'nowrap',
    minWidth: 0,
    width: '100%',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  overflowAuto: {
    overflow: 'auto',
  },
});

export interface CommandBarWrapperProps {
  overflow?: 'hidden' | 'auto';
  className?: string;
  align?: 'start' | 'end';
}

export const CommandBarWrapper: ForwardRefComponent<
  PropsWithChildren<CommandBarWrapperProps>
> = forwardRef(function CommandBarWrapper(
  { children, overflow, className, align = 'start' },
  ref
) {
  const styles = useStyles();

  return (
    <Toolbar
      ref={ref as RefObject<HTMLDivElement>}
      style={{ justifyContent: 'flex-' + align }}
      className={mergeClasses(
        styles.root,
        overflow === 'hidden' ? styles.overflowHidden : styles.overflowAuto,
        className
      )}
    >
      {children}
    </Toolbar>
  );
});

CommandBarWrapper.displayName = 'CommandBarWrapper';
