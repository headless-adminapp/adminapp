import {
  Calendar,
  CalendarDayGridStyles,
  DayOfWeek,
} from '@fluentui/react-calendar-compat';
import { makeStyles, tokens } from '@fluentui/react-components';
import dayjs from 'dayjs';
import { FC, useCallback, useRef } from 'react';

import { useAppStrings } from '../../../App/AppStringContext';
import { applyRoundedStyles } from './utils';

const useStyles = makeStyles({
  selected: {
    color: `${tokens.colorNeutralForeground1Static} !important`,
  },
});

interface CalendarItemProps {
  date1: dayjs.Dayjs | null;
  date2: dayjs.Dayjs | null;
  navigatedDate: dayjs.Dayjs;
  maxDate?: Date;
  minDate?: Date;
  onNavigateDate?: (date: Date) => void;
  onSelectDate?: (date: Date) => void;
}

export const CalendarItem: FC<CalendarItemProps> = ({
  date1,
  date2,
  navigatedDate,
  maxDate,
  minDate,
  onNavigateDate,
  onSelectDate,
}) => {
  const { datePickerStrings } = useAppStrings();

  const date1Ref = useRef<dayjs.Dayjs | null>(date1);
  const date2Ref = useRef<dayjs.Dayjs | null>(date2);
  const navigatedDateRef = useRef<dayjs.Dayjs>(navigatedDate);
  date1Ref.current = date1;
  date2Ref.current = date2;
  navigatedDateRef.current = navigatedDate;
  const styles = useStyles();

  const customDayCellRef = useCallback(
    (element: HTMLElement, date: Date, classNames: CalendarDayGridStyles) => {
      if (!element) {
        return;
      }

      if (!classNames.daySelected) {
        return;
      }

      applyRoundedStyles({
        element,
        navigatedDate: navigatedDateRef.current,
        date: dayjs(date),
        selectedDate1: date1Ref.current,
        selectedDate2: date2Ref.current,
        daySelectedClassNames: classNames.daySelected + ' ' + styles.selected,
      });
    },
    [styles.selected]
  );

  return (
    <Calendar
      showMonthPickerAsOverlay
      showGoToToday={false}
      highlightSelectedMonth={false}
      highlightCurrentMonth={false}
      firstDayOfWeek={DayOfWeek.Monday}
      strings={datePickerStrings}
      calendarDayProps={{
        customDayCellRef: customDayCellRef,
        onNavigateDate: onNavigateDate,
        navigatedDate: navigatedDate.toDate(),
      }}
      calendarMonthProps={{
        navigatedDate: navigatedDate.toDate(),
        onNavigateDate: onNavigateDate,
      }}
      maxDate={maxDate}
      minDate={minDate}
      onSelectDate={onSelectDate}
    />
  );
};
