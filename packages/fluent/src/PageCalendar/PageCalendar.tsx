import { tokens } from '@fluentui/react-components';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { useAuthSession } from '@headless-adminapp/app/auth';
import {
  CalendarContext,
  CalendarContextState,
} from '@headless-adminapp/app/calendar/context';
import {
  CalendarConfig,
  CalendarEventSaveData,
  CalendarEventSaveFnOptions,
} from '@headless-adminapp/app/calendar/types';
import {
  useOpenConfirmDialog,
  useOpenDialog,
} from '@headless-adminapp/app/dialog';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import {
  ContextValue,
  useCreateContextStore,
} from '@headless-adminapp/app/mutable';
import { useProgressIndicator } from '@headless-adminapp/app/progress-indicator';
import { useOpenToastNotification } from '@headless-adminapp/app/toast-notification';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { lazy, useEffect, useState } from 'react';
import { DefaultValues, useForm } from 'react-hook-form';

import { EventDialog } from './EventDialog/EventDialog';
import { Header } from './Header';
import { ViewType } from './types';
import { transformEvent } from './utils';

const CalendarSection = lazy(() =>
  import('./CalendarSection').then((mod) => ({ default: mod.CalendarSection }))
);

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

interface PageCalendarProps<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes,
  SA3 extends SchemaAttributes = SchemaAttributes
> {
  config: CalendarConfig<SA1, SA2, SA3>;
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

  const openDialog = useOpenDialog();
  const openConfirmDialog = useOpenConfirmDialog();
  const openToastNotification = useOpenToastNotification();
  const { hideProgressIndicator, showProgressIndicator } =
    useProgressIndicator();
  const isMobile = useIsMobile();

  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null);
  const [activeEndDate, setActiveEndDate] = useState<Date | null>(null);
  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);
  const [viewType, setViewType] = useState<ViewType>(
    isMobile ? ViewType.Day : ViewType.Month
  );

  const queryClient = useQueryClient();

  const filterForm = useForm<InferredSchemaType<SA3>>({
    mode: 'all',
    defaultValues: config.defaultFilter as DefaultValues<
      InferredSchemaType<SA3>
    >,
    shouldUnregister: false,
  });

  const filterValues = filterForm.watch();
  const auth = useAuthSession();

  const { data: events, isPending: loading } = useQuery({
    queryKey: [
      'calendar-events',
      'list',
      activeStartDate,
      activeEndDate,
      filterValues,
      auth,
    ],
    queryFn: async () => {
      if (!activeStartDate || !activeEndDate) {
        return [];
      }

      try {
        const result = await config.eventsResolver({
          start: activeStartDate,
          end: activeEndDate,
          filter: filterValues,
          auth,
        });

        return result.map(transformEvent);
      } catch (error) {
        openToastNotification({
          title: 'Error',
          text: (error as Error).message,
          type: 'error',
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  function openEventDetailModel(values: unknown) {
    const { close } = openDialog({
      type: 'custom',
      Component: EventDialog,
      props: {
        onDismiss: () => {
          close();
        },
        config,
        values,
        onSubmit: async (data: {
          modifiedValues: Partial<CalendarEventSaveData<SA1, SA2>>;
          values: CalendarEventSaveData<SA1, SA2>;
        }) => {
          try {
            const { id, end, start, title, allDay, description, ...rest } =
              data.values;
            await config.saveEvent({
              event: {
                id,
                title,
                start: start ? new Date(start) : null,
                end: end ? new Date(end) : null,
                allDay: allDay ?? false,
                description,
                ...rest,
              } as CalendarEventSaveFnOptions<SA1, SA2>['event'],
              modifiedValues: data.modifiedValues,
            });

            await queryClient.invalidateQueries({
              queryKey: ['calendar-events'],
            });

            close();
          } catch (error) {
            openToastNotification({
              title: 'Error',
              text: (error as Error).message,
              type: 'error',
            });
          }
        },
        onDelete: async (id: string) => {
          try {
            const confirmResult = await openConfirmDialog({
              title: 'Delete Event',
              text: 'Are you sure you want to delete this event?',
            });

            if (!confirmResult?.confirmed) {
              return;
            }

            showProgressIndicator('Deleting event...');

            await config.deleteEvent(id);

            await queryClient.invalidateQueries({
              queryKey: ['calendar-events'],
            });

            close();
          } catch (error) {
            openToastNotification({
              title: 'Error',
              text: (error as Error).message,
              type: 'error',
            });
          } finally {
            hideProgressIndicator();
          }
        },
        allowOpenRecord: !!config.openRecord,
        onOpenRecord: config.openRecord,
        onCancel: () => {
          close();
        },
      },
    });
  }

  function handleDateSelect(selectInfo: DateSelectArg) {
    if (config.disableCreate) {
      return;
    }

    openEventDetailModel({
      title: '',
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      allDay: selectInfo.allDay,
      customer: null,
      description: '',
    });
  }

  function handleEventClick(clickInfo: EventClickArg) {
    openEventDetailModel({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start?.toISOString(),
      end: clickInfo.event.end?.toISOString(),
      allDay: clickInfo.event.allDay,
      description: '',
      ...clickInfo.event.extendedProps,
    });
  }

  function handleCreateButtonClick() {
    openEventDetailModel({
      title: '',
      start: null,
      end: null,
      allDay: false,
      description: '',
    });
  }

  const onRangeChange = ({
    currentStart,
    currentEnd,
    activeStart,
    activeEnd,
    viewType,
  }: {
    currentStart: Date;
    currentEnd: Date;
    activeStart: Date;
    activeEnd: Date;
    viewType: ViewType;
  }) => {
    setCurrentStartDate(currentStart);
    setCurrentEndDate(currentEnd);
    setActiveStartDate(activeStart);
    setActiveEndDate(activeEnd);
    setViewType(viewType);
  };

  return (
    <CalendarContext.Provider
      value={contextValue as unknown as ContextValue<CalendarContextState>}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: tokens.spacingVerticalM,
          padding: tokens.spacingHorizontalM,
          background: tokens.colorNeutralBackground2,
        }}
      >
        <Header
          filterForm={filterForm}
          onCreateButtonClick={handleCreateButtonClick}
        />
        <CalendarSection
          startDate={currentStartDate}
          endDate={currentEndDate}
          viewType={viewType}
          onRangeChange={onRangeChange}
          events={events ?? []}
          onEventClick={handleEventClick}
          onDateSelect={handleDateSelect}
          loading={loading}
        />
      </div>
    </CalendarContext.Provider>
  );
}
