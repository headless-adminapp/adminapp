import { tokens } from '@fluentui/react-components';
import { TimePicker } from '@fluentui/react-timepicker-compat';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useEffect, useMemo, useRef, useState } from 'react';

import { ControlProps } from './types';

dayjs.extend(customParseFormat);

export interface TimeControlProps extends ControlProps<number> {}

export function TimeControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  placeholder,
  disabled,
  readOnly,
}: Readonly<TimeControlProps>) {
  const {
    timeFormats: { short: timeFormat },
    timezone,
  } = useLocale();
  const [internalTimeValue, setInternalTimeValue] = useState<string>(
    value ? dayjs().startOf('day').add(value, 'minutes').format(timeFormat) : ''
  );

  const internalTimeValueRef = useRef(internalTimeValue);
  internalTimeValueRef.current = internalTimeValue;

  useEffect(() => {
    const updatedValue =
      typeof value === 'number'
        ? dayjs().startOf('day').add(value, 'minutes').format(timeFormat)
        : '';

    if (internalTimeValueRef.current !== updatedValue) {
      setInternalTimeValue(updatedValue);
    }
  }, [value, timezone, timeFormat]);

  const isReadonly = readOnly || disabled;

  const selectedTime = useMemo(() => {
    if (typeof value !== 'number') {
      return null;
    }

    return dayjs().startOf('day').add(value, 'minutes').toDate();
  }, [value]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
      }}
    >
      <TimePicker
        appearance="filled-darker"
        style={{
          flex: 1,
          minWidth: 0,
          pointerEvents: isReadonly ? 'none' : 'auto',
        }}
        placeholder={placeholder}
        id={id}
        name={name}
        input={{
          style: { minWidth: 0 },
        }}
        readOnly={isReadonly}
        selectedTime={selectedTime}
        freeform
        value={internalTimeValue}
        onTimeChange={(_, data) => {
          if (data.selectedTime) {
            onChange?.(
              dayjs(data.selectedTime).diff(dayjs().startOf('day'), 'minutes')
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

            const newValue = dayjs(resolvedTime).diff(
              dayjs().startOf('day'),
              'minutes'
            );

            if (newValue !== value) {
              onChange?.(newValue);
            }

            setInternalTimeValue(dayjs(resolvedTime).format(timeFormat));
          } else {
            setInternalTimeValue('');
            onChange?.(null);
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

function resolveTimeValue(value: string, timeFormat: string): Date | undefined {
  if (!value) {
    return;
  }

  const time = dayjs(value, timeFormat);

  if (!time.isValid()) {
    return;
  }

  return time.toDate();
}
