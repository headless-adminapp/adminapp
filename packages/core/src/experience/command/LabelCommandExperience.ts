import type { Localized } from '../../types';
import type { BaseCommandExperience } from './BaseCommandExperience';

export interface LabelCommandExperience<Context>
  extends BaseCommandExperience<Context> {
  type: 'label';
  text: string;
  localizedTexts?: Localized<string>;
}
