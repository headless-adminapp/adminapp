import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import type { Icon } from '@headless-adminapp/icons';
import { type FC, memo, type Ref } from 'react';

import { ToolbarButton } from '../components/fluent';

const useStyles = makeStyles({
  root: {
    flexShrink: 0,
  },
  danger: {
    '&:hover': {
      color: tokens.colorPaletteRedForeground1,
      background: tokens.colorPaletteRedBackground1,

      '& .fui-Button__icon': {
        color: tokens.colorPaletteRedForeground1,
      },

      '&:active': {
        color: tokens.colorPaletteRedForeground2,
        background: tokens.colorPaletteRedBackground2,

        '& .fui-Button__icon': {
          color: tokens.colorPaletteRedForeground2,
        },
      },
    },
  },
  colored: {
    '&:not(:disabled)': {
      '& .fui-Button__icon': {
        color: tokens.colorBrandForeground1,
      },
    },

    '&:hover:not(:disabled)': {
      color: tokens.colorBrandForeground1,
    },
  },
  dangerColored: {
    '&:not(:disabled)': {
      '& .fui-Button__icon': {
        color: tokens.colorPaletteRedForeground1,
      },
    },

    '&:hover:not(:disabled)': {
      color: tokens.colorPaletteRedForeground1,
    },
  },
});

export interface CommandIconButtonProps {
  Icon: Icon;
  disabled?: boolean;
  onClick?: () => void;
  danger?: boolean;
  appearance?: 'subtle' | 'colored';
  ref?: Ref<HTMLButtonElement>;
}

export const CommandIconButton: FC<CommandIconButtonProps> = memo(
  function CommandIconButton({
    Icon,
    disabled,
    onClick,
    danger,
    appearance,
    ref,
  }) {
    const styles = useStyles();

    return (
      <ToolbarButton
        ref={ref}
        icon={<Icon size={20} />}
        disabled={disabled}
        onClick={onClick}
        className={mergeClasses(
          styles.root,
          appearance === 'colored' && styles.colored,
          danger && styles.danger,
          appearance === 'colored' && danger && styles.dangerColored,
        )}
      />
    );
  },
);

CommandIconButton.displayName = 'CommandIconButton';
