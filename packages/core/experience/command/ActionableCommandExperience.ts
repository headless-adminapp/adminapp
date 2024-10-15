import { AllowArray } from '../../types';
import { BooleanOrFunction } from './types';

export interface ActionableCommandExperience<Context> {
  onClick?: (context: Context) => void | Promise<void>;
  disabled?: AllowArray<BooleanOrFunction<Context>>;
}
