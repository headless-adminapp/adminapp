import type { ButtonCommandExperience } from './ButtonCommandExperience';
import type { IconButtonCommandExperience } from './IconButtonCommandExperience';
import type { MenuComandExperience } from './MenuItemCommandExperience';

export type CommandItemExperience<Context> =
  | IconButtonCommandExperience<Context>
  | ButtonCommandExperience<Context>
  | MenuComandExperience<Context>;
