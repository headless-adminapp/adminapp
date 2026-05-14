import type { Icon } from '@headless-adminapp/icons';

import type { AllowArray } from '../../types';
import type { BooleanOrFunction, IconPosition } from './types';

export interface BaseCommandExperience<Context> {
  Icon: Icon;
  iconPosition?: IconPosition;
  danger?: boolean;
  hidden?: AllowArray<BooleanOrFunction<Context>>;
  appearance?: 'subtle' | 'colored';
}
