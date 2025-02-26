import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';

import { AuthSession } from '../auth';

export interface CalendarEvent {
  id: string;
  title: string;
  start?: Date | null;
  end?: Date | null;
  allDay?: boolean | null;
  description?: string | null;
}

export type CalendarEventExtended<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> = CalendarEvent & InferredSchemaType<SA1> & InferredSchemaType<SA2>;

export interface CalendarEventsResolverFnOptions<
  SA extends SchemaAttributes = SchemaAttributes
> {
  start: Date;
  end: Date;
  filter?: InferredSchemaType<SA>;
  auth: AuthSession | null;
}

export type CalendarEventsResolverFn<
  SA extends SchemaAttributes = SchemaAttributes
> = (options: CalendarEventsResolverFnOptions<SA>) => Promise<CalendarEvent[]>;

export type CalendarEventResolverFn<T extends CalendarEvent = CalendarEvent> = (
  id: string
) => Promise<T>;

export type CalendarEventSaveData<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> = Omit<CalendarEvent, 'id'> & {
  id?: CalendarEvent['id'];
} & InferredSchemaType<SA1> &
  InferredSchemaType<SA2>;

export interface CalendarEventSaveFnOptions<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> {
  event: CalendarEventSaveData<SA1, SA2>;
  modifiedValues: Partial<CalendarEventSaveData<SA1, SA2>>;
}

export type CalendarEventSaveFn<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
> = ({
  event,
  modifiedValues,
}: CalendarEventSaveFnOptions<SA1, SA2>) => Promise<void>;

export interface CalendarConfig<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
> {
  eventsResolver: CalendarEventsResolverFn<SA3>;
  eventResolver?: CalendarEventResolverFn;
  saveEvent: CalendarEventSaveFn<SA1, SA2>;
  beforeDescriptionAttributes?: SA1;
  afterDescriptionAttributes?: SA2;
  filterAttributes?: SA3;
  defaultFilter?: InferredSchemaType<SA3>;
  openRecord?: (id: string) => void;
  deleteEvent: (id: string) => Promise<void>;
  title: string;
  description: string;
  eventLabel: string;
}
