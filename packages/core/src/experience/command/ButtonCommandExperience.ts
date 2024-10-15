import { Localized } from '../../types';
import { ActionableCommandExperience } from './ActionableCommandExperience';
import { BaseCommandExperience } from './BaseCommandExperience';

export interface ButtonCommandExperience<Context>
  extends BaseCommandExperience<Context>,
    ActionableCommandExperience<Context> {
  type: 'button';
  text: string;
  localizedText?: Localized<string>;
  isQuickAction?: boolean;
  isContextMenu?: boolean; // Keep visible for right click context menu
}
