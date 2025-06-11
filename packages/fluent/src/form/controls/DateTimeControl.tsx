import { tokens } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useEffect, useRef, useState } from 'react';

import { SkeletonControl } from './SkeletonControl';
import { resolveTimeValue } from './TimeControl/utils';
import { ControlProps } from './types';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export interface DateTimeControlProps extends ControlProps<string> {
  maxDate?: Date;
  minDate?: Date;
}

export function DateTimeControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  readOnly,
  skeleton,
}: Readonly<DateTimeControlProps>) {
  const {
    dateFormats: { short: dateFormat },
    timeFormats: { short: timeFormat },
    timezone,
  } = useLocale();
  const [internalTimeValue, setInternalTimeValue] = useState<string>(
    value ? dayjs(value).tz(timezone).format(timeFormat) : ''
  );

  const internalTimeValueRef = useRef(internalTimeValue);
  internalTimeValueRef.current = internalTimeValue;

  useEffect(() => {
    const updatedValue = value
      ? dayjs(value).tz(timezone).format(timeFormat)
      : '';

    if (internalTimeValueRef.current !== updatedValue) {
      setInternalTimeValue(updatedValue);
    }
  }, [value, timezone, timeFormat]);

  const isReadonly = readOnly || disabled;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  if (skeleton) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacingHorizontalS,
        }}
      >
        <div style={{ flex: 1 }}>
          <SkeletonControl />
        </div>
        <div style={{ flex: 1 }}>
          <SkeletonControl />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
      }}
    >
      <DatePicker
        id={id}
        name={name}
        open={isDatePickerOpen}
        onOpenChange={(isOpen) => {
          if (isOpen && isReadonly) {
            return;
          }

          setIsDatePickerOpen(isOpen);
          if (!isOpen) {
            onBlur?.();
          }
        }}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
        placeholder={placeholder}
        appearance="filled-darker"
        showMonthPickerAsOverlay
        formatDate={(date) =>
          date ? dayjs(date).tz(timezone).format(dateFormat) : ''
        }
        readOnly={isReadonly}
        value={value ? new Date(value) : null}
        onSelectDate={(date) => {
          if (!date) {
            onChange?.(null);
          } else if (!value) {
            onChange?.(dayjs(date).tz(timezone, true).toISOString());
          } else {
            const dateISOString = dayjs(date).tz(timezone, true).toISOString();

            onChange?.(
              dayjs(dateISOString)
                .tz(timezone)
                .set('hour', dayjs(value).tz(timezone).hour())
                .set('minute', dayjs(value).tz(timezone).minute())
                .set('second', 0)
                .set('millisecond', 0)
                .toISOString()
            );
          }
        }}
        // allowTextInput={true}
        contentAfter={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: -4,
              color: tokens.colorNeutralForeground2,
            }}
          >
            <Icons.Calendar size={20} />
          </div>
        }
        style={{ flex: 1 }}
        input={{
          style: { minWidth: 0, width: '100%' },
        }}
      />
      <TimePicker
        appearance="filled-darker"
        style={{
          flex: 1,
          minWidth: 0,
          pointerEvents: isReadonly ? 'none' : 'auto',
        }}
        input={{
          style: { minWidth: 0 },
        }}
        readOnly={isReadonly || !value}
        // selectedTime={value ? new Date(value) : null}
        selectedTime={
          value
            ? dayjs(
                dayjs(value).tz(timezone).format('YYYY-MM-DD HH:mm:ss')
              ).toDate()
            : null
        }
        freeform
        // formatDateToTimeString={(date) => {
        //   return dayjs(date).tz(timezone).format(timeFormat);
        // }}
        value={internalTimeValue}
        onTimeChange={(_, data) => {
          const dateValue = value
            ? dayjs(value).tz(timezone)
            : dayjs().tz(timezone);
          if (data.selectedTime) {
            onChange?.(
              dateValue
                .set('hour', dayjs(data.selectedTime).tz(timezone, true).hour())
                .set(
                  'minute',
                  dayjs(data.selectedTime).tz(timezone, true).minute()
                )
                .set('second', 0)
                .set('millisecond', 0)
                .toISOString()
            );
          } else if (data.selectedTimeText) {
            let resolvedTime = resolveTimeValue(
              data.selectedTimeText,
              timeFormat
            );

            if (!resolvedTime) {
              setInternalTimeValue(
                value ? dayjs(value).format(timeFormat) : ''
              );
              return;
            }

            const newValue = dateValue
              .set('hour', resolvedTime.getHours())
              .set('minute', resolvedTime.getMinutes())
              .toISOString();

            if (newValue !== value) {
              onChange?.(newValue);
            }

            setInternalTimeValue(
              newValue ? dayjs(newValue).tz(timezone).format(timeFormat) : ''
            );
          }
        }}
        onInput={(e) => {
          setInternalTimeValue(e.currentTarget.value);
        }}
        onBlur={() => {
          onBlur?.();
        }}
        expandIcon={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: -4,
              color: tokens.colorNeutralForeground2,
            }}
          >
            <Icons.Clock size={20} />
          </div>
        }
      />
    </div>
  );
}
