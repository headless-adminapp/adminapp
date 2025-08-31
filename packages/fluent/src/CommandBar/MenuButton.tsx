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
    borderRadius: tokens.borderRadiusMedium,
    '& > button:first-child': {
      fontWeight: tokens.fontWeightRegular,
      paddingRight: 0,
      minWidth: 'unset',
      backgroundColor: 'transparent !important',
    },

    '&:hover:not(:has(:last-child:hover))': {
      backgroundColor: tokens.colorSubtleBackgroundHover,

      '&:active': {
        backgroundColor: tokens.colorSubtleBackgroundPressed,
      },
    },
  },
  menuButton: {
    fontWeight: tokens.fontWeightRegular,
  },
  splitButtonDanger: {
    '&:hover:not(:has(:last-child:hover))': {
      backgroundColor: tokens.colorStatusDangerBackground1,

      '&:active': {
        backgroundColor: tokens.colorStatusDangerBackground2,
      },
    },
    '&:hover': {
      '& > button:first-child': {
        color: tokens.colorStatusDangerForeground1,
        // color: tokens.colorPaletteRedForeground1,
        // background: tokens.colorPaletteRedBackground1,

        '& .fui-Button__icon': {
          color: tokens.colorStatusDangerForeground1,
        },

        '&:active': {
          color: tokens.colorStatusDangerForeground2,
          // background: tokens.colorPaletteRedBackground2,

          '& .fui-Button__icon': {
            color: tokens.colorStatusDangerForeground2,
          },
        },
      },
    },

    '& > button:last-child': {
      '&:hover, &[aria-expanded="true"]': {
        backgroundColor: tokens.colorStatusDangerBackground1,

        '&:active': {
          backgroundColor: tokens.colorStatusDangerBackground2,
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
                primaryActionButton={{
                  onClick,
                }}
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
    );
  })
);

CommandMenuButton.displayName = 'CommandMenuButton';
