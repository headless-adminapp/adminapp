import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { CalendarConfig } from './types';

export function defineCalendarConfig<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
>(config: CalendarConfig<SA1, SA2, SA3>): CalendarConfig<SA1, SA2, SA3> {
  return config;
}
