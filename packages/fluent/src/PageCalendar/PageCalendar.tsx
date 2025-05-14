import { CalendarProvider } from '@headless-adminapp/app/calendar/CalendarProvider';
import { CalendarContextState } from '@headless-adminapp/app/calendar/context';
import { CalendarConfig } from '@headless-adminapp/app/calendar/types';
import { useCreateContextStore } from '@headless-adminapp/app/mutable';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useEffect } from 'react';

import { PageCalendarUI } from './PageCalendarUI';

interface PageCalendarProps<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
> {
  config: CalendarConfig<SA1, SA2, SA3>;
  initialView?: string;
  initialDate?: string; // YYYY-MM-DD
  onChange?: (view: string, date: string) => void;
}

export function PageCalendar<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
>(props: Readonly<PageCalendarProps<SA1, SA2, SA3>>) {
  const contextValue = useCreateContextStore<CalendarContextState<SA1>>({
    config: props.config,
  });

  useEffect(() => {
    contextValue.setValue({
      config: props.config,
    });
  }, [contextValue, props.config]);

  const config = props.config;

  return (
    <CalendarProvider config={config}>
      <PageCalendarUI
        initialView={props.initialView}
        initialDate={props.initialDate}
        onChange={props.onChange}
      />
    </CalendarProvider>
  );
}
