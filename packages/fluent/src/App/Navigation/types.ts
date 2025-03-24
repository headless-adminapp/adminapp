import { DrawerProps } from '@fluentui/react-components';
import {
  NavPageCategory,
  NavPageItem,
  NavPageSection,
} from '@headless-adminapp/core/experience/app';
import { Icon } from '@headless-adminapp/icons';

export type DrawerType = Required<DrawerProps>['type'];

type NavPageItemWithKey = NavPageItem & { key: string };
type NavPageCategoryWithKey = Omit<NavPageCategory, 'items'> & {
  key: string;
  items: Array<NavPageItemWithKey>;
};

export type NavPageSectionWithKey = Omit<NavPageSection, 'items'> & {
  key: string;
  items: Array<NavItemInfo | NavCategoryInfo>;
};

export interface NavItemInfo {
  type: 'item';
  key: string;
  label: string;
  Icon: Icon;
  link: string;
  active: boolean;
  isExternal: boolean;
  RightComponent?: React.ComponentType;
}

export interface NavCategoryInfo {
  type: 'category';
  key: string;
  label: string;
  Icon: Icon;
  items: NavSubItemInfo[];
}

export interface NavSubItemInfo {
  type: 'subItem';
  key: string;
  label: string;
  link: string;
  active: boolean;
  isExternal: boolean;
}

export interface NavPageItemTransformed {
  label?: string;
  Icon?: Icon;
  link: string;
  isExternal: boolean;
}
