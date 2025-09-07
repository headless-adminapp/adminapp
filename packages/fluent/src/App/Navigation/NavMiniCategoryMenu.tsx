import { Menu, MenuList, MenuTrigger } from '@fluentui/react-components';
import { FC } from 'react';

import { MenuItem, MenuPopover } from '../../components/fluent';
import { NavItemComponent } from './NavItemComponent';
import { NavCategoryInfo, NavSubItemInfo } from './types';
import { usePrefetch } from './usePrefetch';

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
            <NavMenuItem key={subItem.key} item={subItem} onSelect={onSelect} />
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

interface NavMenuItemProps {
  item: NavSubItemInfo;
  onSelect: (item: NavSubItemInfo) => void;
}

const NavMenuItem: FC<NavMenuItemProps> = ({ item, onSelect }) => {
  usePrefetch(item);

  return <MenuItem onClick={() => onSelect(item)}>{item.label}</MenuItem>;
};
