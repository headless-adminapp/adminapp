import type { EventInput } from '@fullcalendar/core';
import { CalendarEvent } from '@headless-adminapp/app/calendar/types';

export function transformEvent(event: CalendarEvent): EventInput {
  const { id, title, description, end, start, ...rest } = event;

  return {
    id,
    title,
    description,
    start: start ?? undefined,
    end: end ?? undefined,
    allDay: event.allDay ?? false,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    extendedProps: rest,
  };
}
