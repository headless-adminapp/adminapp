import type { Icon } from '@headless-adminapp/icons';

import { AllowArray } from '../../types';
import { BooleanOrFunction, IconPosition } from './types';

export interface BaseCommandExperience<Context> {
  Icon: Icon;
  iconPosition?: IconPosition;
  danger?: boolean;
  hidden?: AllowArray<BooleanOrFunction<Context>>;
}
