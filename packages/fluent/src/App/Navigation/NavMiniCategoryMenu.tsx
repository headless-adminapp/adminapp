import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import { FC } from 'react';

import { NavItemComponent } from './NavItemComponent';
import { NavCategoryInfo, NavSubItemInfo } from './types';

interface NavMiniCategoryMenuProps {
  item: NavCategoryInfo;
  isActive: boolean;
  onSelect: (item: NavSubItemInfo) => void;
}

export const NavMiniCategoryMenu: FC<NavMiniCategoryMenuProps> = ({
  item,
  isActive,
  onSelect,
}) => {
  return (
    <Menu positioning="after-top">
      <MenuTrigger>
        <div>
          <NavItemComponent
            key={item.key}
            item={{
              key: item.key,
              active: isActive,
              Icon: item.Icon,
              label: item.label,
              link: '',
              isExternal: false,
              RightComponent: undefined,
              type: 'item',
            }}
            onClick={() => {}}
            isMini
          />
        </div>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {item.items.map((subItem) => (
            <MenuItem key={subItem.key} onClick={() => onSelect(subItem)}>
              {subItem.label}
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
