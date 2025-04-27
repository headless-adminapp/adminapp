import { tokens } from '@fluentui/react-components';
import { NavItem } from '@fluentui/react-nav-preview';
import { FC } from 'react';

import { NavItemInfo } from './types';

interface NavItemComponentProps {
  item: NavItemInfo;
  onClick: (item: NavItemInfo) => void;
  isMini?: boolean;
}

export const NavItemComponent: FC<NavItemComponentProps> = ({
  item,
  onClick,
  isMini,
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
      {!isMini && (
        <>
          {item.label}
          {!!item.RightComponent && (
            <span
              style={{ flex: 1, justifyContent: 'flex-end', display: 'flex' }}
            >
              <item.RightComponent />
            </span>
          )}
        </>
      )}
    </NavItem>
  );
};
