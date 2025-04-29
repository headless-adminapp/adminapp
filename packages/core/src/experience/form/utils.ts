import { SchemaAttributes } from '@headless-adminapp/core/schema';

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
