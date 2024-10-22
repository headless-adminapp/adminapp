import { MenuDivider } from '@fluentui/react-components';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { Fragment } from 'react';

import { MenuItem, MenuItemProps } from './MenuItem';

export interface MenuItemsProps {
  items?: ArrayGroupWithAtLeastOne<MenuItemProps>;
}

export const MenuItems: React.FC<MenuItemsProps> = ({ items }) => {
  return (
    <Fragment>
      {items?.map((group, index) => (
        <Fragment key={index}>
          {index > 0 && <MenuDivider />}
          {group.map((item, index) => (
            <MenuItem
              key={index}
              Icon={item.Icon}
              onClick={item.onClick}
              text={item.text}
              danger={item.danger}
              disabled={item.disabled}
              items={item.items}
            />
          ))}
        </Fragment>
      ))}
    </Fragment>
  );
};
