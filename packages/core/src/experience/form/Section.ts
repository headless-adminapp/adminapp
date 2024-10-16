import { SchemaAttributes } from '../../schema';
import { Localized } from '../../types';
import {
  SectionQuickViewControl,
  SectionSpacerControl,
  SectionStatndardControl,
  SectionSubgridControl,
} from './SectionControl';
import { SectionEditableGridControl } from './SectionEditableGridControl';

export interface Section<S extends SchemaAttributes = SchemaAttributes> {
  name: string;
  label: string;
  localizedLabels?: Localized<string>;
  hideLabel?: boolean;
  noPadding?: boolean;
  hidden?: boolean;
  columnCount?: 1 | 2 | 3 | 4;
  labelPosition?: 'top' | 'left';
  controls: (
    | SectionStatndardControl<S>
    | SectionSubgridControl
    | SectionQuickViewControl
    | SectionEditableGridControl
    | SectionSpacerControl
  )[];
}