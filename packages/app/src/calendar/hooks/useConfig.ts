import { useContextSelector } from '@headless-adminapp/app/mutable';
import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { CalendarContext } from '../context';
import { CalendarConfig } from '../types';

export function useConfig<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
>() {
  return useContextSelector(
    CalendarContext,
    (state) => state.config as CalendarConfig<SA1, SA2, SA3>
  );
}
