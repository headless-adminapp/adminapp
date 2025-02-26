import { Calendar, DateRangeType } from '@fluentui/react-calendar-compat';
import {
  Button,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  tokens,
} from '@fluentui/react-components';
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
  const label = useMemo(() => {
    if (!start || !end) {
      return '';
    }

    switch (viewType) {
      case ViewType.Day:
        return dayjs(start).format('MMM D, YYYY');
      case ViewType.Week:
        return `${dayjs(start).format('MMM D')} - ${dayjs(end).format(
          'MMM D, YYYY'
        )}`;
      case ViewType.Month:
        return dayjs(start).format('MMMM YYYY');
    }

    return '';
  }, [start, end, viewType]);

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
              console.log('d', date);
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
