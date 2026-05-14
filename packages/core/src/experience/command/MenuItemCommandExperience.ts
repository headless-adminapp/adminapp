import type { ArrayGroupWithAtLeastOne, Localized } from '../../types';
import type { ActionableCommandExperience } from './ActionableCommandExperience';
import type { BaseCommandExperience } from './BaseCommandExperience';

export interface MenuItemCommandExperience<Context>
  extends BaseCommandExperience<Context>,
    ActionableCommandExperience<Context> {
  text: string;
  localizedTexts?: Localized<string>;
  items?: ArrayGroupWithAtLeastOne<MenuItemCommandExperience<Context>>;
}

export interface MenuComandExperience<Context>
  extends BaseCommandExperience<Context>,
    ActionableCommandExperience<Context> {
  type: 'menu';
  text: string;
  isContextMenu?: boolean; // Keep visible for right click context menu
  items: ArrayGroupWithAtLeastOne<MenuItemCommandExperience<Context>>;
  localizedTexts?: Localized<string>;
}
