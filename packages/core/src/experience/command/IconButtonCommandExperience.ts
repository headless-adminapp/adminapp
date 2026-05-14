import type { ActionableCommandExperience } from './ActionableCommandExperience';
import type { BaseCommandExperience } from './BaseCommandExperience';

export interface IconButtonCommandExperience<Context>
  extends BaseCommandExperience<Context>,
    ActionableCommandExperience<Context> {
  type: 'icon';
  isQuickAction?: boolean;
}
