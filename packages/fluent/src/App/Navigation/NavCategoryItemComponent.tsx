import { makeStyles, tokens } from '@fluentui/react-components';
import { NavCategoryItem } from '@fluentui/react-nav-preview';
import { IconPlaceholder } from '@headless-adminapp/icons';
import { FC } from 'react';

import { NavCategoryInfo } from './types';

const useStyles = makeStyles({
  activeNavCategoryItem: {
    '&[aria-expanded="false"]': {
      backgroundColor: tokens.colorNeutralBackground4Hover,
    },
  },
});

interface NavCategoryItemComponentProps {
  item: NavCategoryInfo;
  isActive: boolean;
}

export const NavCategoryItemComponent: FC<NavCategoryItemComponentProps> = ({
  item,
  isActive,
}) => {
  const styles = useStyles();
  const Icon = item.Icon ?? IconPlaceholder;

  return (
    <NavCategoryItem
      icon={
        <Icon
          filled={isActive}
          color={
            isActive ? 'var(--colorNeutralForeground2BrandSelected)' : undefined
          }
        />
      }
      className={isActive ? styles.activeNavCategoryItem : undefined}
    >
      {item.label}
    </NavCategoryItem>
  );
};
