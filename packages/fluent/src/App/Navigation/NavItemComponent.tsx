import { NavItem, tokens } from '@fluentui/react-components';
import { FC } from 'react';

import { extendedTokens } from '../../components/fluent';
import { NavItemInfo } from './types';
import { usePrefetch } from './usePrefetch';

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
  usePrefetch(item);

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
        borderRadius: extendedTokens.paperBorderRadius,
        paddingBlock: extendedTokens.navItempaddingVertical,
      }}
      icon={
        <item.Icon
          size="1.4em"
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
