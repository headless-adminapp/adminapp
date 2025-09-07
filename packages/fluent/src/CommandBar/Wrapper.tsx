import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  Toolbar,
} from '@fluentui/react-components';
import {
  forwardRef,
  memo,
  MemoExoticComponent,
  PropsWithChildren,
  RefObject,
} from 'react';

const useStyles = makeStyles({
  root: {
    flexWrap: 'nowrap',
    minWidth: 0,
    width: '100%',
    padding: '4px',
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

export const CommandBarWrapper: MemoExoticComponent<
  ForwardRefComponent<PropsWithChildren<CommandBarWrapperProps>>
> = memo(
  forwardRef(function CommandBarWrapper(
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
  })
);

CommandBarWrapper.displayName = 'CommandBarWrapper';
