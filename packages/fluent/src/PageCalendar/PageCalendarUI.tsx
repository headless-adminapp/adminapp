import { tokens } from '@fluentui/react-components';
import type { DateSelectArg } from '@fullcalendar/core';
import { useAuthSession } from '@headless-adminapp/app/auth';
import { useConfig } from '@headless-adminapp/app/calendar/hooks';
import { useOpenDetailDialog } from '@headless-adminapp/app/calendar/hooks/useOpenDetailDialog';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import { useRouter, useRouteResolver } from '@headless-adminapp/app/route';
import { useOpenToastNotification } from '@headless-adminapp/app/toast-notification';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { lazy, Suspense, useMemo, useState } from 'react';
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

function strToViewType(view: string): ViewType | undefined {
  switch (view) {
    case 'month':
    case ViewType.Month:
      return ViewType.Month;
    case 'week':
    case ViewType.Week:
      return ViewType.Week;
    case 'day':
    case ViewType.Day:
      return ViewType.Day;
    default:
      return undefined;
  }
}

function viewTypeToStr(view: ViewType): string {
  switch (view) {
    case ViewType.Month:
      return 'month';
    case ViewType.Week:
      return 'week';
    case ViewType.Day:
      return 'day';
  }
}

function getInitialView(isMobile: boolean, initialView?: string): ViewType {
  if (initialView) {
    const _view = strToViewType(initialView);

    if (_view) {
      return _view;
    }
  }

  return isMobile ? ViewType.Day : ViewType.Month;
}

interface PageCalendarUIProps {
  initialView?: string;
  initialDate?: string; // YYYY-MM-DD
  onChange?: (view: string, date: string) => void;
}

export function PageCalendarUI<SA3 extends SchemaAttributes = SchemaAttributes>(
  props: Readonly<PageCalendarUIProps>
) {
  const config = useConfig();

  const openToastNotification = useOpenToastNotification();
  const isMobile = useIsMobile();
  const { timezone } = useLocale();

  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null);
  const [activeEndDate, setActiveEndDate] = useState<Date | null>(null);
  const [currentStartDate, setCurrentStartDate] = useState<Date | null>(null);
  const [currentEndDate, setCurrentEndDate] = useState<Date | null>(null);
  const [viewType, setViewType] = useState<ViewType>(
    getInitialView(isMobile, props.initialView)
  );

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

  const initialDate = useMemo(() => {
    if (!props.initialDate) {
      return undefined;
    }

    return dayjs(props.initialDate).tz(timezone, true).toDate();
  }, [props.initialDate, timezone]);

  const openEventDetailModel = useOpenDetailDialog(EventDialog);
  const router = useRouter();
  const routeResolver = useRouteResolver();
  const openForm = useOpenForm();

  const selectable = useMemo(() => {
    if (!config.createOptions) {
      return false;
    }

    if (config.createOptions.mode === 'dialog') {
      return true;
    }

    if (config.createOptions.mode === 'custom') {
      return config.createOptions.allowQuickCreate ?? false;
    }

    return false;
  }, [config.createOptions]);

  const handleNewRecord = (values: Record<string, unknown>) => {
    if (!config.createOptions) {
      return;
    }

    if (config.createOptions.mode === 'dialog') {
      if (!config.saveEvent) {
        return;
      }
      openEventDetailModel(values);
    } else if (config.createOptions.mode === 'custom') {
      config.createOptions.onClick(values, {
        openForm,
        router,
        routeResolver,
      });
    }
  };

  function handleDateSelect(selectInfo: DateSelectArg) {
    if (!config.createOptions) {
      return;
    }

    if (
      config.createOptions.mode === 'custom' &&
      !config.createOptions.allowQuickCreate
    ) {
      return;
    }

    if (config.disableAllDay && selectInfo.allDay) {
      return;
    }

    handleNewRecord({
      title: '',
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      allDay: selectInfo.allDay,
      customer: null,
      description: '',
    });
  }

  function handleCreateButtonClick() {
    handleNewRecord({
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

    props.onChange?.(
      viewTypeToStr(viewType),
      dayjs(currentStart).tz(timezone).format('YYYY-MM-DD')
    );
  };

  return (
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
      <Suspense>
        <CalendarSection
          startDate={currentStartDate}
          endDate={currentEndDate}
          viewType={viewType}
          onRangeChange={onRangeChange}
          events={events ?? []}
          onDateSelect={handleDateSelect}
          loading={loading}
          selectable={selectable}
          initialDate={initialDate}
        />
      </Suspense>
    </div>
  );
}
