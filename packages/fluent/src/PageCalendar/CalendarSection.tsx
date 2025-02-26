import { Button, tokens } from '@fluentui/react-components';
import {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo, useRef } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { renderEventContent } from './renderEventContent';
import { TitleSelector } from './TitleSelector';
import { ViewType } from './types';
import { ViewSelector } from './ViewSelector';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

interface CalendarSectionProps {
  startDate: Date | null;
  endDate: Date | null;
  viewType: ViewType;
  onRangeChange?: (props: {
    currentStart: Date;
    currentEnd: Date;
    activeStart: Date;
    activeEnd: Date;
    viewType: ViewType;
  }) => void;
  events: EventInput[];
  onEventClick?: (event: EventClickArg) => void;
  onDateSelect?: (event: DateSelectArg) => void;
  loading?: boolean;
}

export const CalendarSection = ({
  startDate,
  endDate,
  viewType,
  onRangeChange,
  events,
  onDateSelect,
  onEventClick,
  loading,
}: Readonly<CalendarSectionProps>) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { timezone } = useLocale();

  const isToday = useMemo(() => {
    if (!startDate || !endDate) {
      return false;
    }

    let today = dayjs().tz(timezone);

    if (viewType === ViewType.Month) {
      today = today.startOf('month');
    } else if (viewType === ViewType.Week) {
      today = today.startOf('isoWeek');
    }

    return (
      today.format('YYYY-MM-DD') ===
      dayjs(startDate).tz(timezone).format('YYYY-MM-DD')
    );
  }, [startDate, endDate, timezone, viewType]);

  function handleDateRangeChange(props: DatesSetArg) {
    const currentStart = props.view.currentStart;
    const currentEnd = props.view.currentEnd;
    const activeStart = props.view.activeStart;
    const activeEnd = props.view.activeEnd;
    switch (props.view.type) {
      case ViewType.Month:
        onRangeChange?.({
          currentStart: currentStart, //dayjs(currentStart).tz(timezone).startOf('month').toDate(),
          currentEnd: currentEnd, // dayjs(currentEnd).tz(timezone).endOf('month').toDate(),
          activeStart: activeStart, // dayjs(activeStart).tz(timezone).startOf('day').toDate(),
          activeEnd: activeEnd, // dayjs(activeEnd).tz(timezone).endOf('day').toDate(),
          viewType: ViewType.Month,
        });
        break;
      case ViewType.Week:
        onRangeChange?.({
          currentStart: dayjs(currentStart)
            .tz(timezone)
            .startOf('isoWeek')
            .toDate(),
          currentEnd: dayjs(currentEnd).tz(timezone).endOf('isoWeek').toDate(),
          activeStart: dayjs(activeStart).tz(timezone).startOf('day').toDate(),
          activeEnd: dayjs(activeEnd).tz(timezone).endOf('day').toDate(),
          viewType: ViewType.Week,
        });
        break;
      case ViewType.Day:
        onRangeChange?.({
          currentStart: dayjs(currentStart)
            .tz(timezone)
            .startOf('day')
            .toDate(),
          currentEnd: dayjs(currentEnd).tz(timezone).endOf('day').toDate(),
          activeStart: dayjs(activeStart).tz(timezone).startOf('day').toDate(),
          activeEnd: dayjs(activeEnd).tz(timezone).endOf('day').toDate(),
          viewType: ViewType.Day,
        });
        break;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'relative',
        background: tokens.colorNeutralBackground1,
        padding: tokens.spacingHorizontalL,
        borderRadius: tokens.borderRadiusMedium,
        boxShadow: tokens.shadow2,
        gap: tokens.spacingVerticalM,
      }}
    >
      <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
        <div
          style={{ flex: 1, display: 'flex', gap: tokens.spacingHorizontalS }}
        >
          <Button
            appearance="outline"
            style={{ fontWeight: tokens.fontWeightMedium }}
            icon={<Icons.Calendar />}
            onClick={() => calendarRef.current?.getApi().today()}
            disabled={isToday}
          >
            Today
          </Button>
          <Button
            appearance="subtle"
            icon={<Icons.ChevronLeft />}
            onClick={() => calendarRef.current?.getApi().prev()}
          />
          <Button
            appearance="subtle"
            icon={<Icons.ChevronRight />}
            onClick={() => calendarRef.current?.getApi().next()}
          />
        </div>
        <TitleSelector
          start={startDate}
          end={endDate}
          onChange={(start) => {
            const api = calendarRef.current?.getApi();

            if (!api) {
              return;
            }

            api.gotoDate(start);
          }}
          viewType={viewType}
        />
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
          <ViewSelector
            viewType={viewType}
            onChange={(viewType) => {
              calendarRef.current?.getApi().changeView(viewType);
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={ViewType.Month}
            weekends={true}
            firstDay={1}
            events={events}
            datesSet={handleDateRangeChange}
            select={onDateSelect}
            eventClick={onEventClick}
            eventContent={renderEventContent}
            timeZone={timezone}
            height="100%"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            eventMinHeight={24}
            eventTimeFormat={(props) => {
              return dayjs(props.start.marker).tz(timezone).format('hh:mm A');
            }}
            headerToolbar={false}
          />
        </div>
        <BodyLoading loading={loading} />
      </div>
    </div>
  );
};
