import { SchemaAttributes } from '../../schema';
import { Localized } from '../../types';
import { Section } from './Section';

export interface Tab<S extends SchemaAttributes = SchemaAttributes> {
  name: string;
  label: string;
  localizedLabels?: Localized<string>;
  columnCount: 1 | 2 | 3 | 4;
  columnWidths?: Array<number | string | [number, number | string]>; // Array<width | [minWidth, width]>
  tabColumns: TabColumn<S>[];
}

export interface TabColumn<S extends SchemaAttributes = SchemaAttributes> {
  // width?: number | string; // px or %
  // minWidth?: number; // px
  sections: Section<S>[];
}
