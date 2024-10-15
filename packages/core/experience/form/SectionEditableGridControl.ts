import { SchemaAttributes } from '../../schema';
import { BaseSectionControl } from './SectionControl';

export interface SectionEditableGridControl<
  S extends SchemaAttributes = SchemaAttributes
> extends BaseSectionControl {
  type: 'editablegrid';
  attributeName: string; // alias for form state
  attributes: (keyof S)[];
  summary: {
    attribute: keyof S;
    type: 'sum' | 'avg' | 'min' | 'max' | 'count';
  }[];
  logicalName: string; // logical name of the entity
  referenceAttribute: keyof S;
  format: 'grid' | 'card';
}
