import { createContext } from '@headless-adminapp/app/mutable';
import type { SchemaAttributes } from '@headless-adminapp/core/schema';

import { CalendarConfig } from './types';

export interface CalendarContextState<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
> {
  config: CalendarConfig<SA1, SA2, SA3>;
}

export const CalendarContext = createContext<CalendarContextState>();
