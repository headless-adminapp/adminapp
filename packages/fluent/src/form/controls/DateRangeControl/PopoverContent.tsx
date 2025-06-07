import { Button, Divider, tokens } from '@fluentui/react-components';
import dayjs from 'dayjs';
import { FC, useState } from 'react';

import { CalendarItem } from './CalendarItem';
import { selectMaxDate } from './utils';

interface PopoverContentProps {
  value: [string, string] | null;
  minDate?: Date;
  maxDate?: Date;
  onChange?: (value: [string, string] | null) => void;
  required?: boolean;
  showApplyButton?: boolean;
}
export const PopoverContent: FC<PopoverContentProps> = ({
  value,
  minDate,
  maxDate,
  onChange,
  required,
  showApplyButton,
}) => {
  const [internalValue, setInternalValue] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([value ? dayjs(value[0]) : null, value ? dayjs(value[1]) : null]);

  const [navigationDate1, setNavigationDate1] = useState<dayjs.Dayjs>(
    value ? dayjs(value[0]) : dayjs()
  );
  const [navigationDate2, setNavigationDate2] = useState<dayjs.Dayjs>(
    value
      ? selectMaxDate(dayjs(internalValue[0]).add(1, 'month'), internalValue[1])
      : dayjs().add(1, 'month')
  );

  const [date1, date2] = internalValue;

  const leftMaxDate =
    !date1 && date2
      ? dayjs(date2).subtract(1, 'month').endOf('month').toDate()
      : undefined;
  const rightMinDate =
    !date2 && date1
      ? dayjs(date1).add(1, 'month').startOf('month').toDate()
      : undefined;

  const handleCalendarChange = (date: Date, isLeftCalendar: boolean) => {
    if ((date1 && date2) || (!date1 && !date2)) {
      if (isLeftCalendar) {
        setInternalValue([dayjs(date), null]);
        setNavigationDate2(dayjs(date).add(1, 'month'));
      } else {
        setInternalValue([null, dayjs(date)]);
        setNavigationDate1(dayjs(date).subtract(1, 'month'));
      }
    } else {
      const v = [date1, date2].filter(Boolean) as dayjs.Dayjs[];

      v.push(dayjs(date));

      v.sort((a, b) => a.valueOf() - b.valueOf());

      setInternalValue(v.map((d) => d) as [dayjs.Dayjs, dayjs.Dayjs]);

      if (!showApplyButton) {
        onChange?.([v[0].format('YYYY-MM-DD'), v[1].format('YYYY-MM-DD')]);
      }
    }
  };

  const actions = [];

  if (!required) {
    actions.push(
      <Button
        key="clear"
        size="small"
        appearance="secondary"
        onClick={() => {
          onChange?.(null);
          setInternalValue([null, null]);
        }}
      >
        Clear
      </Button>
    );
  }

  if (showApplyButton) {
    actions.push(
      <Button
        key="apply"
        size="small"
        appearance="primary"
        disabled={!internalValue[0] || !internalValue[1]}
        onClick={() => {
          if (!internalValue[0] || !internalValue[1]) {
            return;
          }

          onChange?.([
            dayjs(internalValue[0]).format('YYYY-MM-DD'),
            dayjs(internalValue[1]).format('YYYY-MM-DD'),
          ]);
        }}
      >
        Apply
      </Button>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div style={{ display: 'flex' }}>
          <CalendarItem
            date1={date1}
            date2={date2}
            navigatedDate={navigationDate1}
            maxDate={leftMaxDate ?? maxDate}
            minDate={minDate}
            onSelectDate={(date) => {
              handleCalendarChange(date, true);
            }}
            onNavigateDate={(date) => {
              setNavigationDate1(dayjs(date));
            }}
          />
          <Divider vertical style={{ opacity: 0.2 }} />
          <CalendarItem
            date1={date1}
            date2={date2}
            navigatedDate={navigationDate2}
            minDate={rightMinDate ?? minDate}
            maxDate={maxDate}
            onSelectDate={(date) => {
              handleCalendarChange(date, false);
            }}
            onNavigateDate={(date) => {
              setNavigationDate2(dayjs(date));
            }}
          />
        </div>
        <Divider style={{ opacity: 0.5 }} />
        <div
          style={{
            display: 'flex',
            gap: tokens.spacingHorizontalS,
            padding: tokens.spacingVerticalS,
            justifyContent: 'flex-end',
          }}
        >
          {actions}
        </div>
      </div>
    </div>
  );
};
