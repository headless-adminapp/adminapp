import { makeStyles, mergeClasses, Toolbar } from '@fluentui/react-components';
import { type FC, memo, type PropsWithChildren, type Ref } from 'react';

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
  ref?: Ref<HTMLDivElement>;
}

export const CommandBarWrapper: FC<PropsWithChildren<CommandBarWrapperProps>> =
  memo(function CommandBarWrapper({
    children,
    overflow,
    className,
    ref,
    align = 'start',
  }) {
    const styles = useStyles();

    return (
      <Toolbar
        ref={ref}
        style={{ justifyContent: 'flex-' + align }}
        className={mergeClasses(
          styles.root,
          overflow === 'hidden' ? styles.overflowHidden : styles.overflowAuto,
          className,
        )}
      >
        {children}
      </Toolbar>
    );
  });

CommandBarWrapper.displayName = 'CommandBarWrapper';
