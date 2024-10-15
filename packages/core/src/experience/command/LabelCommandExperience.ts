import { Localized } from '../../types';
import { BaseCommandExperience } from './BaseCommandExperience';

export interface LabelCommandExperience<Context>
  extends BaseCommandExperience<Context> {
  type: 'label';
  text: string;
  localizedTexts?: Localized<string>;
}
