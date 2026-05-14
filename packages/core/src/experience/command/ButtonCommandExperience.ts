import type { Localized } from '../../types';
import type { ActionableCommandExperience } from './ActionableCommandExperience';
import type { BaseCommandExperience } from './BaseCommandExperience';

export interface ButtonCommandExperience<Context>
  extends BaseCommandExperience<Context>,
    ActionableCommandExperience<Context> {
  type: 'button';
  text: string;
  localizedText?: Localized<string>;
  isQuickAction?: boolean;
  isContextMenu?: boolean; // Keep visible for right click context menu
}
