import { Localized } from '../../types';

export interface Metadata {
  id: string;
  name: string;
  logicalName: string;
  localizedNames?: Localized<string>;
}
