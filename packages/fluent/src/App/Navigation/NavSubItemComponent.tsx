import { tokens } from '@fluentui/react-components';
import { NavSubItem } from '@fluentui/react-nav-preview';
import { FC } from 'react';

import { NavSubItemInfo } from './types';

interface NavSubItemComponentProps {
  item: NavSubItemInfo;
  onClick: (item: NavSubItemInfo) => void;
}

export const NavSubItemComponent: FC<NavSubItemComponentProps> = ({
  item,
  onClick,
}) => {
  return (
    <NavSubItem
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
      value={item.active ? 'active' : ''}
    >
      {item.label}
    </NavSubItem>
  );
};
