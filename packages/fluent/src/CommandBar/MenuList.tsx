import {
  MenuItem,
  MenuList as InternalMenuList,
  tokens,
} from '@fluentui/react-components';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { memo } from 'react';

import { MenuItemProps } from './MenuItem';
import { MenuItems } from './MenuItems';

export interface MenuItemsProps {
  items?: ArrayGroupWithAtLeastOne<MenuItemProps>;
}

export const MenuList: React.FC<MenuItemsProps> = memo(({ items }) => {
  return (
    <InternalMenuList>
      {!items?.length ? (
        <MenuItem
          style={{
            color: tokens.colorNeutralForegroundDisabled,
            fontStyle: 'italic',
          }}
        >
          No items
        </MenuItem>
      ) : (
        <MenuItems items={items} />
      )}
    </InternalMenuList>
  );
});

MenuList.displayName = 'MenuList';
