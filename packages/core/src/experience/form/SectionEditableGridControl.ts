import { SchemaAttributes } from '../../schema';
import { SortOrder } from '../../transport';
import { BaseSectionControl, SectionStatndardControl } from './SectionControl';

export interface SectionEditableGridControl<
  S extends SchemaAttributes = SchemaAttributes
> extends BaseSectionControl {
  type: 'editablegrid';
  logicalName: string; // logical name of the entity
  associatedAttribute: keyof S;
  format: 'grid' | 'card';
  alias: false | string; // false if use form save action indivisual or alias name attached in form state
  controls: (keyof S | SectionStatndardControl<S>)[];
  summary: {
    attribute: keyof S;
    type: 'sum' | 'avg' | 'min' | 'max' | 'count';
  }[];
  sort?: Array<{
    field: keyof S;
    order: SortOrder;
  }>;
}
