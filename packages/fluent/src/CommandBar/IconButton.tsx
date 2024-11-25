import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  tokens,
  ToolbarButton,
} from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';
import { forwardRef, memo, MemoExoticComponent } from 'react';

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
});

export interface CommandIconButtonProps {
  Icon: Icon;
  disabled?: boolean;
  onClick?: () => void;
  danger?: boolean;
}

export const CommandIconButton: MemoExoticComponent<
  ForwardRefComponent<CommandIconButtonProps>
> = memo(
  forwardRef(function CommandIconButton(
    { Icon, disabled, onClick, danger },
    ref
  ) {
    const styles = useStyles();

    return (
      <ToolbarButton
        ref={ref}
        icon={<Icon size={20} />}
        disabled={disabled}
        onClick={onClick}
        className={mergeClasses(styles.root, danger && styles.danger)}
      />
    );
  })
);

CommandIconButton.displayName = 'CommandIconButton';
