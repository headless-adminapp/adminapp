import {
  ForwardRefComponent,
  makeStyles,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuPopover,
  MenuTrigger,
  mergeClasses,
  SplitButton,
  tokens,
} from '@fluentui/react-components';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';
import { forwardRef, memo, MemoExoticComponent } from 'react';

import { MenuItemProps } from './MenuItem';
import { MenuList } from './MenuList';

const useStyles = makeStyles({
  splitButton: {
    '& > button:first-child': {
      fontWeight: tokens.fontWeightRegular,
      borderRightColor: tokens.colorNeutralStroke3,
    },
  },
  menuButton: {
    fontWeight: tokens.fontWeightRegular,
  },
  splitButtonDanger: {
    '& > button:first-child:hover': {
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

export interface CommandMenuButtonProps {
  Icon: Icon;
  text: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  appearance?: 'subtle' | 'colored';
  items: ArrayGroupWithAtLeastOne<MenuItemProps>;
}

export const CommandMenuButton: MemoExoticComponent<
  ForwardRefComponent<CommandMenuButtonProps>
> = memo(
  forwardRef(function CommandMenuButton(
    { Icon, items, text, danger, disabled, onClick },
    ref
  ) {
    const styles = useStyles();

    return (
      // <div ref={ref}>
      <Menu hasIcons positioning="below-end">
        {onClick ? (
          <MenuTrigger disableButtonEnhancement>
            {(triggerProps: MenuButtonProps) => (
              <SplitButton
                ref={ref}
                icon={<Icon size={20} />}
                appearance="subtle"
                className={mergeClasses(
                  styles.splitButton,
                  danger && styles.splitButtonDanger
                )}
                menuButton={triggerProps}
                disabled={disabled}
              >
                {text}
              </SplitButton>
            )}
          </MenuTrigger>
        ) : (
          <MenuTrigger disableButtonEnhancement>
            <MenuButton
              ref={ref}
              appearance="subtle"
              icon={<Icon size={20} />}
              className={mergeClasses(styles.menuButton)}
            >
              {text}
            </MenuButton>
          </MenuTrigger>
        )}

        <MenuPopover>
          <MenuList items={items} />
        </MenuPopover>
      </Menu>
      // </div>
    );
  })
);

CommandMenuButton.displayName = 'CommandMenuButton';
