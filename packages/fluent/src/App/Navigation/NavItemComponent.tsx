import { tokens } from '@fluentui/react-components';
import { NavItem } from '@fluentui/react-nav-preview';
import { FC } from 'react';

import { NavItemInfo } from './types';

interface NavItemComponentProps {
  item: NavItemInfo;
  onClick: (item: NavItemInfo) => void;
}

export const NavItemComponent: FC<NavItemComponentProps> = ({
  item,
  onClick,
}) => {
  return (
    <NavItem
      href={item.link}
      onClick={(event) => {
        event.preventDefault();
        onClick(item);
      }}
      style={{
        backgroundColor: item.active
          ? tokens.colorNeutralBackground4Hover
          : undefined,
      }}
      icon={
        <item.Icon
          size={20}
          filled={item.active}
          color={
            item.active
              ? 'var(--colorNeutralForeground2BrandSelected)'
              : undefined
          }
        />
      }
      value={item.active ? 'active' : ''}
    >
      {item.label}
    </NavItem>
  );
};
