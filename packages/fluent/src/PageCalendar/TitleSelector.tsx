import { Calendar, DateRangeType } from '@fluentui/react-calendar-compat';
import {
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
} from '@fluentui/react-components';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { iconSet } from '@headless-adminapp/icons-fluent';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { FC, useMemo } from 'react';

import { ViewType } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

interface TitleSelectorProps {
  start?: Date | null;
  end?: Date | null;
  viewType: ViewType;
  onChange: (start: Date, end: Date) => void;
}

export const TitleSelector: FC<TitleSelectorProps> = ({
  start,
  end,
  onChange,
  viewType,
}) => {
  const { timezone } = useLocale();
  const isMobile = useIsMobile();
  const label = useMemo(() => {
    if (!start || !end) {
      return '';
    }

    switch (viewType) {
      case ViewType.Day:
        return dayjs(start)
          .tz(timezone)
          .format(isMobile ? 'MMM D' : 'MMM D, YYYY');
      case ViewType.Week:
        if (isMobile) {
          return `${dayjs(start).tz(timezone).format('MMM D')} - ${dayjs(end)
            .tz(timezone)
            .subtract(1, 'millisecond')
            .format('D')}`;
        }
        return `${dayjs(start).tz(timezone).format('MMM D')} - ${dayjs(end)
          .tz(timezone)
          .subtract(1, 'millisecond')
          .format('MMM D, YYYY')}`;
      case ViewType.Month:
        return dayjs(start)
          .tz(timezone)
          .format(isMobile ? 'MMM YYYY' : 'MMMM YYYY');
    }

    return '';
  }, [start, end, viewType, timezone, isMobile]);

  if (!start || !end) {
    return null;
  }

  return (
    <Popover positioning="below">
      <PopoverTrigger>
        <Button
          appearance="subtle"
          style={{
            fontWeight: tokens.fontWeightMedium,
            fontSize: tokens.fontSizeBase400,
          }}
          icon={<iconSet.ChevronDown size={16} />}
          iconPosition="after"
        >
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverSurface tabIndex={-1} style={{ padding: 0 }}>
        {viewType === ViewType.Month && (
          <Calendar
            dateRangeType={DateRangeType.Month}
            highlightSelectedMonth
            isDayPickerVisible={false}
            value={start ? dayjs(start).toDate() : new Date()}
            onSelectDate={(date) => {
              const start = dayjs(date)
                .tz(timezone, true)
                .startOf('month')
                .toDate();
              const end = dayjs(date)
                .tz(timezone, true)
                .endOf('month')
                .toDate();

              onChange(start, end);
            }}
          />
        )}
        {viewType === ViewType.Week && (
          <Calendar
            dateRangeType={DateRangeType.Week}
            firstDayOfWeek={1}
            value={start ? dayjs(start).toDate() : new Date()}
            onSelectDate={(date) => {
              const start = dayjs(date)
                .tz(timezone, true)
                .startOf('isoWeek')
                .toDate();
              const end = dayjs(date)
                .tz(timezone, true)
                .endOf('isoWeek')
                .toDate();

              onChange(start, end);
            }}
          />
        )}
        {viewType === ViewType.Day && (
          <Calendar
            dateRangeType={DateRangeType.Day}
            firstDayOfWeek={1}
            value={start ? dayjs(start).toDate() : new Date()}
            onSelectDate={(date) => {
              const start = dayjs(date)
                .tz(timezone, true)
                .startOf('day')
                .toDate();
              const end = dayjs(date).tz(timezone, true).endOf('day').toDate();

              onChange(start, end);
            }}
          />
        )}
      </PopoverSurface>
    </Popover>
  );
};
