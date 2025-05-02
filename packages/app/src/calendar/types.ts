import { AuthSession } from '@headless-adminapp/core/experience/auth';
import { OpenFormOptions } from '@headless-adminapp/core/experience/command';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';

import { InternalRouteResolver, RouterInstance } from '../route/context';

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
) => Promise<Partial<T>>;

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
  saveEvent?: CalendarEventSaveFn<SA1, SA2>; // required for dialog mode
  beforeDescriptionAttributes?: SA1;
  afterDescriptionAttributes?: SA2;
  filterAttributes?: SA3;
  defaultFilter?: InferredSchemaType<SA3>;
  deleteEvent?: (id: string) => Promise<void>;
  title: string;
  description: string;
  eventLabel: string;
  disableAllDay?: boolean;
  createOptions?:
    | {
        mode: 'dialog';
      }
    | {
        mode: 'custom';
        allowQuickCreate?: boolean;
        onClick: (
          defaultValues: Record<string, unknown>,
          options: {
            router: RouterInstance;
            routeResolver: InternalRouteResolver;
            openForm: (options: OpenFormOptions) => void;
          }
        ) => void;
      };
  editOptions?:
    | {
        mode: 'dialog';
      }
    | {
        mode: 'custom';
        onClick: (
          event: CalendarEvent,
          options: {
            router: RouterInstance;
            routeResolver: InternalRouteResolver;
            openForm: (options: OpenFormOptions) => void;
          }
        ) => void;
      };
}
