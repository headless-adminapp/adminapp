import { Button, tokens } from '@fluentui/react-components';
import { DateSelectArg, DatesSetArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useIsMobile } from '@headless-adminapp/app/hooks';
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
  onDateSelect?: (event: DateSelectArg) => void;
  loading?: boolean;
  selectable?: boolean;
  initialDate?: Date;
}

export const CalendarSection = ({
  startDate,
  endDate,
  viewType,
  onRangeChange,
  events,
  onDateSelect,
  loading,
  selectable,
  initialDate,
}: Readonly<CalendarSectionProps>) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { timezone, timeFormats } = useLocale();
  const isMobile = useIsMobile();

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
          currentStart: currentStart,
          currentEnd: currentEnd,
          activeStart: activeStart,
          activeEnd: activeEnd,
          viewType: ViewType.Month,
        });
        break;
      case ViewType.Week:
        onRangeChange?.({
          currentStart: currentStart,
          currentEnd: currentEnd,
          activeStart: activeStart,
          activeEnd: activeEnd,
          viewType: ViewType.Week,
        });
        break;
      case ViewType.Day:
        onRangeChange?.({
          currentStart: currentStart,
          currentEnd: currentEnd,
          activeStart: activeStart,
          activeEnd: activeEnd,
          viewType: ViewType.Day,
        });
        break;
    }
  }

  const initialScrollTime = useMemo(() => {
    const now = dayjs().tz(timezone);

    if (now.hour() < 3) {
      return '00:00:00';
    }

    const time = dayjs()
      .tz(timezone)
      .subtract(1, 'hour')
      .startOf('hour')
      .format('HH:mm:ss');

    return time;
  }, [timezone]);

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
      <div
        style={{
          display: 'flex',
          gap: tokens.spacingHorizontalS,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
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
          {isMobile && (
            <div
              style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}
            >
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
            </div>
          )}
        </div>
        {!isMobile && (
          <div>
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
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: isMobile ? 'flex-start' : 'flex-end',
          }}
        >
          <ViewSelector
            viewType={viewType}
            onChange={(viewType) => {
              calendarRef.current?.getApi().changeView(viewType);
              calendarRef.current?.getApi().scrollToTime(initialScrollTime);
            }}
          />
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              momentTimezonePlugin,
            ]}
            initialView={viewType}
            initialDate={initialDate}
            weekends={true}
            firstDay={1}
            events={events}
            datesSet={handleDateRangeChange}
            select={onDateSelect}
            eventContent={renderEventContent}
            timeZone={timezone}
            height="100%"
            nowIndicator={true}
            scrollTime={initialScrollTime}
            scrollTimeReset={false}
            editable={false}
            selectable={selectable}
            selectMirror={true}
            dayMaxEvents={true}
            eventMinHeight={24}
            eventTimeFormat={(props) => {
              return dayjs(
                new Date(
                  props.start.year,
                  props.start.month,
                  props.start.day,
                  props.start.hour,
                  props.start.minute
                )
              ).format(timeFormats.short);
            }}
            headerToolbar={false}
          />
        </div>
        <BodyLoading loading={loading} />
      </div>
    </div>
  );
};
