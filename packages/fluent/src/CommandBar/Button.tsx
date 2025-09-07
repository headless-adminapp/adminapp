import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';
import { forwardRef, memo, MemoExoticComponent } from 'react';

import { ToolbarButton } from '../components/fluent';

const useStyles = makeStyles({
  root: {
    minWidth: 'unset',
    textWrap: 'nowrap',
    flexShrink: 0,
  },
  danger: {
    '&:hover:not(:disabled)': {
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

export interface CommandButtonProps {
  Icon: Icon;
  iconPosition?: 'before' | 'after';
  text: string;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  appearance?: 'subtle' | 'colored';
}

export const CommandButton: MemoExoticComponent<
  ForwardRefComponent<CommandButtonProps>
> = memo(
  forwardRef(function CommandButton(
    {
      Icon,
      text,
      danger,
      onClick,
      disabled,
      iconPosition = 'before',
      appearance,
    },
    ref
  ) {
    const styles = useStyles();

    return (
      <ToolbarButton
        ref={ref}
        type="button"
        icon={Icon ? <Icon size={20} /> : undefined}
        iconPosition={iconPosition}
        disabled={disabled}
        onClick={onClick}
        className={mergeClasses(
          styles.root,
          appearance === 'colored' && styles.colored,
          danger && styles.danger,
          appearance === 'colored' && danger && styles.dangerColored
        )}
      >
        {text}
      </ToolbarButton>
    );
  })
);

CommandButton.displayName = 'CommandButton';
