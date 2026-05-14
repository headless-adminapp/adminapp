import { NavSubItem, tokens } from '@fluentui/react-components';
import type { FC } from 'react';

import type { NavSubItemInfo } from './types';
import { usePrefetch } from './usePrefetch';

interface NavSubItemComponentProps {
  item: NavSubItemInfo;
  onClick: (item: NavSubItemInfo) => void;
}

export const NavSubItemComponent: FC<NavSubItemComponentProps> = ({
  item,
  onClick,
}) => {
  usePrefetch(item);

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
