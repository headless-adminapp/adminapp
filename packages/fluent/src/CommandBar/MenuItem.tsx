import {
  makeStyles,
  Menu,
  MenuItem as InternalMenuItem,
  MenuPopover,
  MenuSplitGroup,
  MenuTrigger,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

import { MenuList } from './MenuList';

const useStyles = makeStyles({
  splitMenuRight: {
    '& .fui-MenuItem__icon': {
      display: 'none',
    },
  },
  danger: {
    '&:hover': {
      color: tokens.colorPaletteRedForeground1,
      background: tokens.colorPaletteRedBackground1,

      '& .fui-MenuItem__icon': {
        color: tokens.colorPaletteRedForeground1,
      },

      '&:active': {
        color: tokens.colorPaletteRedForeground2,
        background: tokens.colorPaletteRedBackground2,

        '& .fui-MenuItem__icon': {
          color: tokens.colorPaletteRedForeground2,
        },
      },
    },
  },
});

export interface MenuItemProps {
  Icon: Icon;
  text: string;
  disabled?: boolean;
  danger?: boolean;
  onClick: (() => void) | undefined;
  items?: ArrayGroupWithAtLeastOne<MenuItemProps>;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  Icon,
  text,
  disabled,
  danger,
  onClick,
  items,
}) => {
  const styles = useStyles();

  if (!items?.length) {
    return (
      <InternalMenuItem
        disabled={disabled}
        onClick={onClick}
        icon={<Icon />}
        className={mergeClasses(danger && styles.danger)}
      >
        {text}
      </InternalMenuItem>
    );
  }

  return (
    <Menu hasIcons>
      {onClick ? (
        <MenuSplitGroup>
          <InternalMenuItem
            icon={<Icon />}
            className={mergeClasses(danger && styles.danger)}
          >
            {text}
          </InternalMenuItem>
          <MenuTrigger disableButtonEnhancement>
            <InternalMenuItem className={mergeClasses(styles.splitMenuRight)} />
          </MenuTrigger>
        </MenuSplitGroup>
      ) : (
        <MenuTrigger disableButtonEnhancement>
          <InternalMenuItem icon={<Icon />}>{text}</InternalMenuItem>
        </MenuTrigger>
      )}

      <MenuPopover>
        <MenuList items={items} />
      </MenuPopover>
    </Menu>
  );
};