import { ButtonCommandExperience } from './ButtonCommandExperience';
import { IconButtonCommandExperience } from './IconButtonCommandExperience';
import { MenuComandExperience } from './MenuItemCommandExperience';

export type CommandItemExperience<Context> =
  | IconButtonCommandExperience<Context>
  | ButtonCommandExperience<Context>
  | MenuComandExperience<Context>;
