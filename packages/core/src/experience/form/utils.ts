import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { SectionQuickViewControl } from './SectionControl';
import { SectionEditableGridControl } from './SectionEditableGridControl';

export function defineSectionEditableGridControl<
  S extends SchemaAttributes = SchemaAttributes
>(
  control: Omit<SectionEditableGridControl<S>, 'type'>
): SectionEditableGridControl<SchemaAttributes> {
  return {
    ...control,
    type: 'editablegrid',
  } as SectionEditableGridControl<SchemaAttributes>;
}

export function defineSectionQuickViewControl<
  S extends SchemaAttributes = SchemaAttributes
>(
  control: Omit<SectionQuickViewControl<S>, 'type'>
): SectionQuickViewControl<SchemaAttributes> {
  return {
    ...control,
    type: 'quickview',
  } as SectionQuickViewControl<SchemaAttributes>;
}
