import { SchemaAttributes } from '../../schema';
import { Localized } from '../../types';
import { SectionControl } from './SectionControl';

export interface Section<S extends SchemaAttributes = SchemaAttributes> {
  name: string;
  label: string;
  localizedLabels?: Localized<string>;
  hideLabel?: boolean;
  fullHeight?: boolean;
  noPadding?: boolean;
  hidden?: boolean;
  columnCount?: 1 | 2 | 3 | 4;
  labelPosition?: 'top' | 'left';
  controls: SectionControl<S>[];
}
