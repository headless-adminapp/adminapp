import { tokens } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect, useRef, useState } from 'react';

// import { useLocale } from '@react-adminapp/components';
import { ControlProps } from './types';

dayjs.extend(customParseFormat);

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
}: DateTimeControlProps) {
  // const { shortDate: dateFormat } = useLocale();
  const [internalTimeValue, setInternalTimeValue] = useState<string>(
    value ? dayjs(value).format('hh:mm A') : ''
  );

  const internalTimeValueRef = useRef(internalTimeValue);
  internalTimeValueRef.current = internalTimeValue;

  useEffect(() => {
    const updatedValue = value ? dayjs(value).format('hh:mm A') : '';

    if (internalTimeValueRef.current !== updatedValue) {
      setInternalTimeValue(updatedValue);
    }
  }, [value]);

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
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
        placeholder={placeholder}
        appearance="filled-darker"
        formatDate={(date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')}
        disabled={disabled}
        readOnly={readOnly}
        value={value ? new Date(value) : null}
        onSelectDate={(date) => {
          if (!date) {
            onChange?.(null);
          } else if (!value) {
            onChange?.(date.toISOString());
          } else {
            onChange?.(
              dayjs(date)
                .set('hour', dayjs(value).hour())
                .set('minute', dayjs(value).minute())
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
        style={{ flex: 1, minWidth: 0 }}
        input={{
          style: { minWidth: 0 },
        }}
        readOnly={readOnly || disabled || !value}
        selectedTime={value ? new Date(value) : null}
        freeform
        value={internalTimeValue}
        onTimeChange={(_, data) => {
          const dateValue = value ? new Date(value) : new Date();
          if (data.selectedTime) {
            onChange?.(
              dayjs(dateValue)
                .set('hour', data.selectedTime.getHours())
                .set('minute', data.selectedTime.getMinutes())
                .toISOString()
            );
          } else if (data.selectedTimeText) {
            let resolvedTime = resolveTimeValue(data.selectedTimeText);

            if (!resolvedTime) {
              setInternalTimeValue(value ? dayjs(value).format('hh:mm A') : '');
              return;
            }

            const newValue = dayjs(dateValue)
              .set('hour', resolvedTime.getHours())
              .set('minute', resolvedTime.getMinutes())
              .toISOString();

            if (newValue !== value) {
              onChange?.(newValue);
            }

            setInternalTimeValue(
              newValue ? dayjs(newValue).format('hh:mm A') : ''
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

function resolveTimeValue(value: string): Date | undefined {
  if (!value) {
    return;
  }

  const time = dayjs(value, 'hh:mm A');

  console.log('resolveTimeValue', time);

  if (!time.isValid()) {
    return;
  }

  return time.toDate();
}
