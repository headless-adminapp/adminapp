import { Divider, tokens } from '@fluentui/react-components';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { FC, useMemo, useState } from 'react';

import { useAppStrings } from '../../../App/AppStringContext';
import { Button } from '../../../components/fluent';
import GroupedSelectControl, {
  GroupedSelectControlProps,
} from '../GroupedSelectControl';
import { CalendarItem } from './CalendarItem';
import { selectMaxDate } from './utils';
dayjs.extend(isoWeek);

const DATE_FORMAT = 'YYYY-MM-DD';

function createOption(label: string, values: [string, string]) {
  return {
    label,
    value: `${values[0]}_${values[1]}`,
  };
}

function getFiscalYear(date: dayjs.Dayjs) {
  if (date.month() < 3) {
    return date.year() - 1;
  }
  return date.year();
}

function startOfFiscalYear(year: number) {
  return dayjs(`${year}-04-01`).startOf('day');
}

function endOfFiscalYear(year: number) {
  return dayjs(`${year + 1}-03-31`).endOf('day');
}

function relativeStartOfFiscalyear(offset: number) {
  const currentFY = getFiscalYear(dayjs());
  const targetFY = currentFY + offset;
  return startOfFiscalYear(targetFY);
}

function relativeEndOfFiscalyear(offset: number) {
  const currentFY = getFiscalYear(dayjs());
  const targetFY = currentFY + offset;
  return endOfFiscalYear(targetFY);
}

function useQuickOptionGroups() {
  const { operatorStrings } = useAppStrings();

  return useMemo(() => {
    const options: GroupedSelectControlProps<string>['optionGroups'] = [];

    options.push({
      label: 'Week',
      options: [
        createOption(operatorStrings.thisWeek, [
          dayjs().startOf('isoWeek').format(DATE_FORMAT),
          dayjs().endOf('isoWeek').format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.nextWeek, [
          dayjs().add(1, 'week').startOf('isoWeek').format(DATE_FORMAT),
          dayjs().add(1, 'week').endOf('isoWeek').format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.lastWeek, [
          dayjs().subtract(1, 'week').startOf('isoWeek').format(DATE_FORMAT),
          dayjs().subtract(1, 'week').endOf('isoWeek').format(DATE_FORMAT),
        ]),
      ],
    });

    options.push({
      label: 'Month',
      options: [
        createOption(operatorStrings.thisMonth, [
          dayjs().startOf('month').format(DATE_FORMAT),
          dayjs().endOf('month').format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.nextMonth, [
          dayjs().add(1, 'month').startOf('month').format(DATE_FORMAT),
          dayjs().add(1, 'month').endOf('month').format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.lastMonth, [
          dayjs().subtract(1, 'month').startOf('month').format(DATE_FORMAT),
          dayjs().subtract(1, 'month').endOf('month').format(DATE_FORMAT),
        ]),
      ],
    });

    options.push({
      label: 'Year',
      options: [
        createOption(operatorStrings.thisYear, [
          dayjs().startOf('year').format(DATE_FORMAT),
          dayjs().endOf('year').format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.nextYear, [
          dayjs().add(1, 'year').startOf('year').format(DATE_FORMAT),
          dayjs().add(1, 'year').endOf('year').format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.lastYear, [
          dayjs().subtract(1, 'year').startOf('year').format(DATE_FORMAT),
          dayjs().subtract(1, 'year').endOf('year').format(DATE_FORMAT),
        ]),
      ],
    });

    options.push({
      label: 'Fiscal Year',
      options: [
        createOption(operatorStrings.thisFiscalYear, [
          relativeStartOfFiscalyear(0).format(DATE_FORMAT),
          relativeEndOfFiscalyear(0).format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.nextFiscalYear, [
          relativeStartOfFiscalyear(1).format(DATE_FORMAT),
          relativeEndOfFiscalyear(1).format(DATE_FORMAT),
        ]),
        createOption(operatorStrings.lastFiscalYear, [
          relativeStartOfFiscalyear(-1).format(DATE_FORMAT),
          relativeEndOfFiscalyear(-1).format(DATE_FORMAT),
        ]),
      ],
    });

    return options;
  }, [operatorStrings]);
}

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

  const optionGroups = useQuickOptionGroups();

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
            alignItems: 'center',
          }}
        >
          <div style={{ minWidth: 120 }}>
            <GroupedSelectControl
              placeholder="Custom range"
              value={`${date1?.format(DATE_FORMAT) ?? ''}_${
                date2?.format(DATE_FORMAT) ?? ''
              }`}
              size="small"
              onChange={(value) => {
                if (!value) {
                  return;
                }
                const parts = value.split('_');
                const date1 = dayjs(parts[0]);
                const date2 = dayjs(parts[1]);

                setNavigationDate1(dayjs(parts[0]));

                if (
                  date1.year() === date2.year() &&
                  date1.month() === date2.month()
                ) {
                  setNavigationDate2(dayjs(parts[0]).add(1, 'month'));
                } else {
                  setNavigationDate2(date2);
                }
                setInternalValue([dayjs(parts[0]), dayjs(parts[1])]);

                if (!showApplyButton) {
                  onChange?.(parts as [string, string]);
                }
              }}
              optionGroups={optionGroups}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flex: 1,
              gap: tokens.spacingHorizontalS,
              justifyContent: 'flex-end',
            }}
          >
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};
