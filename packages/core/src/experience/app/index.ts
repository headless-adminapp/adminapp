import type { Icon } from '@headless-adminapp/icons';

import { Localized } from '../../types';
import { EntityMainFormCommandItemExperience } from '../form';
import {
  EntityMainGridCommandItemExperience,
  SubGridCommandItemExperience,
} from '../view';

interface BasePageItem {
  label?: string;
  localizedLabel?: Localized<string>;
  icon?: Icon;
}

export enum PageType {
  EntityView = 'entityview',
  EntityForm = 'entityform',
  External = 'external',
  Custom = 'custom',
  Dashboard = 'dashboard',
  Report = 'report',
}

interface BasePageEntityView {
  type: PageType.EntityView;
  logicalName: string;
  viewId?: string;
}

interface BasePageEntiyForm {
  type: PageType.EntityForm;
  logicalName: string;
  formId?: string;
  id?: string | number | null; // record id
  defaultParams?: Record<string, unknown>;
}

interface BasePageExternalLink {
  type: PageType.External;
  link: string;
}

interface BasePageCustom {
  type: PageType.Custom;
  link: string;
  noBasePrefix?: boolean;
}

interface BasePageDashboard {
  type: PageType.Dashboard;
  dashboardId?: string;
}

interface BasePageReport {
  type: PageType.Report;
  reportId: string;
  label: string;
}

interface PageEntityView extends BasePageItem, BasePageEntityView {}

export interface PageEntiyForm extends BasePageItem, BasePageEntiyForm {}

interface PageExternalLink extends BasePageItem, BasePageExternalLink {
  icon: Icon;
  label: string;
}

interface PageCustom extends BasePageItem, BasePageCustom {
  icon?: Icon;
  label: string;
}

interface PageDashboard extends BasePageItem, BasePageDashboard {
  icon?: Icon;
  label: string;
}

interface PageReport extends BasePageItem, BasePageReport {
  icon?: Icon;
  label: string;
}

export type NavPageItem =
  | PageEntityView
  | PageEntiyForm
  | PageExternalLink
  | PageCustom
  | PageDashboard
  | PageReport;

export interface NavPageGroup {
  label: string;
  hideLabel?: boolean;
  items: NavPageItem[];
}

export interface NavPageGroupArea {
  label: string;
  groups: NavPageGroup[];
}

export interface AccountMenuItem {
  label: string;
  localizedLabel?: Localized<string>;
  icon: Icon;
  link?: string;
  onClick?: () => void;
}

export interface QuickActionItem {
  label: string;
  localizedLabel?: Localized<string>;
  icon: Icon;
  link?: string;
  onClick?: () => void;
}

export interface AppExperience {
  id: string;
  logo: {
    Icon?: Icon;
    image?: string;
  };
  title: string;
  shortTitle?: string;
  enableArea?: boolean;
  navItems: NavPageGroupArea[];
  defaultPage?: NavPageItem;
  accountMenuItems?: AccountMenuItem[];
  quickActionItems?: QuickActionItem[];

  viewCommands?: EntityMainGridCommandItemExperience[][];
  subgridCommands?: SubGridCommandItemExperience[][];
  formCommands?: EntityMainFormCommandItemExperience[][];
}
