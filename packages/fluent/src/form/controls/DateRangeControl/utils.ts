import { DateRangeFormat } from '@headless-adminapp/core/experience/locale/types';
import dayjs from 'dayjs';

export function formatDateRange(
  value: [string, string] | null,
  dateRangeFormat: DateRangeFormat
) {
  if (!value || value.length !== 2) {
    return '';
  }

  const [start, end] = value.map((date) => dayjs(date));

  if (start.isSame(end, 'year')) {
    if (start.isSame(end, 'month')) {
      if (start.isSame(end, 'day')) {
        return start.format(dateRangeFormat.date);
      } else {
        return (
          start.format(dateRangeFormat.sameMonth[0]) +
          dateRangeFormat.separator +
          end.format(dateRangeFormat.sameMonth[1])
        );
      }
    } else {
      return (
        start.format(dateRangeFormat.sameYear[0]) +
        dateRangeFormat.separator +
        end.format(dateRangeFormat.sameYear[1])
      );
    }
  } else {
    return (
      start.format(dateRangeFormat.date) +
      dateRangeFormat.separator +
      end.format(dateRangeFormat.date)
    );
  }
}

const cornersClassNames = {
  topRightCornerDate: 'fui-CalendarDayGrid__topRightCornerDate',
  topLeftCornerDate: 'fui-CalendarDayGrid__topLeftCornerDate',
  bottomRightCornerDate: 'fui-CalendarDayGrid__bottomRightCornerDate',
  bottomLeftCornerDate: 'fui-CalendarDayGrid__bottomLeftCornerDate',
};

function checkIsSameMonth(date1: dayjs.Dayjs, date2: dayjs.Dayjs) {
  return date1.isSame(date2, 'month');
}

export function applyRoundedStyles({
  element,
  date,
  navigatedDate,
  selectedDate1,
  selectedDate2,
  daySelectedClassNames,
}: {
  element: HTMLElement;
  date: dayjs.Dayjs;
  navigatedDate: dayjs.Dayjs;
  selectedDate1: dayjs.Dayjs | null;
  selectedDate2: dayjs.Dayjs | null;
  daySelectedClassNames: string;
}) {
  const _date = date;
  const _navigatedDate = navigatedDate;
  const _selectedDate1 = selectedDate1;
  const _selectedDate2 = selectedDate2;

  const isSameMonth = checkIsSameMonth(_navigatedDate, _date);

  const isSelected =
    isSameMonth &&
    selectedDate1 &&
    selectedDate2 &&
    date >= selectedDate1 &&
    date <= selectedDate2;

  if (!isSelected) {
    element.classList.remove(...daySelectedClassNames.split(' '));
    element.classList.add(cornersClassNames.topLeftCornerDate);
    element.classList.add(cornersClassNames.topRightCornerDate);
    element.classList.add(cornersClassNames.bottomLeftCornerDate);
    element.classList.add(cornersClassNames.bottomRightCornerDate);
    return;
  }

  const aboveDate = _date.subtract(7, 'day');
  const belowDate = _date.add(7, 'day');
  const leftDate = _date.subtract(1, 'day');
  const rightDate = _date.add(1, 'day');

  const isFirstDay = _date.day() === 1; // Monday
  const isLastDay = _date.day() === 0; // Sunday

  const isAboveDateInRange = !aboveDate.isBefore(_selectedDate1);
  const isBelowDateInRange = !belowDate.isAfter(_selectedDate2);
  const isLeftDateInRange = !leftDate.isBefore(_selectedDate1);
  const isRightDateInRange = !rightDate.isAfter(_selectedDate2);

  const isAboveDateInSameMonth = checkIsSameMonth(aboveDate, _navigatedDate);
  const isBelowDateInSameMonth = checkIsSameMonth(belowDate, _navigatedDate);
  const isLeftDateInSameMonth = checkIsSameMonth(leftDate, _navigatedDate);
  const isRightDateInSameMonth = checkIsSameMonth(rightDate, _navigatedDate);

  const nothingOnLeft =
    !isLeftDateInRange || isFirstDay || !isLeftDateInSameMonth;
  const nothingOnRight =
    !isRightDateInRange || isLastDay || !isRightDateInSameMonth;
  const nothingAbove = !isAboveDateInRange || !isAboveDateInSameMonth;
  const nothingBelow = !isBelowDateInRange || !isBelowDateInSameMonth;

  const hasTopLeftRadius = nothingOnLeft && nothingAbove;
  const hasTopRightRadius = nothingOnRight && nothingAbove;
  const hasBottomLeftRadius = nothingOnLeft && nothingBelow;
  const hasBottomRightRadius = nothingOnRight && nothingBelow;

  const classToAdd = daySelectedClassNames.split(' ');
  const classToRemove: string[] = [];

  if (hasTopLeftRadius) {
    classToAdd.push(cornersClassNames.topLeftCornerDate);
  } else {
    classToRemove.push(cornersClassNames.topLeftCornerDate);
  }

  if (hasTopRightRadius) {
    classToAdd.push(cornersClassNames.topRightCornerDate);
  } else {
    classToRemove.push(cornersClassNames.topRightCornerDate);
  }

  if (hasBottomLeftRadius) {
    classToAdd.push(cornersClassNames.bottomLeftCornerDate);
  } else {
    classToRemove.push(cornersClassNames.bottomLeftCornerDate);
  }

  if (hasBottomRightRadius) {
    classToAdd.push(cornersClassNames.bottomRightCornerDate);
  } else {
    classToRemove.push(cornersClassNames.bottomRightCornerDate);
  }

  element.classList.add(...classToAdd);
  element.classList.remove(...classToRemove);
}

export function selectMaxDate(
  date1: dayjs.Dayjs,
  date2: dayjs.Dayjs | null
): dayjs.Dayjs {
  if (!date2) {
    return date1;
  }

  return date1.isAfter(date2) ? date1 : date2;
}

export function selectMinDate(
  date1: dayjs.Dayjs,
  date2: dayjs.Dayjs | null
): dayjs.Dayjs {
  if (!date2) {
    return date1;
  }

  return date1.isBefore(date2) ? date1 : date2;
}
