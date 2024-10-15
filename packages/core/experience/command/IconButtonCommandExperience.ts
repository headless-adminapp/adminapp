import { ActionableCommandExperience } from './ActionableCommandExperience';
import { BaseCommandExperience } from './BaseCommandExperience';

export interface IconButtonCommandExperience<Context>
  extends BaseCommandExperience<Context>,
    ActionableCommandExperience<Context> {
  type: 'icon';
  isQuickAction?: boolean;
}
