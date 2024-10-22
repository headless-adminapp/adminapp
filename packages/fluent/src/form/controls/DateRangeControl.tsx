import { DatePicker } from '@fluentui/react-datepicker-compat';
import { useLocale } from '@headless-adminapp/app/locale';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { ControlProps } from './types';

export interface DateRangeControlProps
  extends ControlProps<[string | null, string | null]> {
  maxDate?: Date;
  minDate?: Date;
}

export function DateRangeControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  disabled,
  maxDate,
  minDate,
  readOnly,
}: DateRangeControlProps) {
  const [from, setFrom] = useState<string | null>(value ? value[0] : null);
  const [to, setTo] = useState<string | null>(value ? value[1] : null);
  const { datePickerStrings } = useAppStrings();
  const { dateFormats } = useLocale();

  useEffect(() => {
    if (value) {
      setFrom(value[0]);
      setTo(value[1]);
    }
  }, [value]);

  const _minDate = minDate
    ? new Date(minDate)
    : from
    ? new Date(from)
    : undefined;

  const _maxDate = maxDate ? new Date(maxDate) : to ? new Date(to) : undefined;

  const handleChangeFrom = (date: Date | null | undefined) => {
    setFrom(date ? date.toISOString() : null);

    // if (date && to) {
    onChange?.([date?.toISOString() ?? null, to]);
    // }
  };

  const handleChangeTo = (date: Date | null | undefined) => {
    setTo(date ? date.toISOString() : null);

    // if (date && from) {
    onChange?.([from, date?.toISOString() ?? null]);
    // }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <DatePicker
        id={id}
        name={name}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
        placeholder="From"
        appearance="filled-darker"
        disabled={disabled}
        readOnly={readOnly}
        formatDate={(date) =>
          date ? dayjs(date).format(dateFormats.short) : ''
        }
        value={from ? new Date(from) : null}
        onSelectDate={(date) => handleChangeFrom(date)}
        strings={datePickerStrings}
        minDate={minDate}
        maxDate={_maxDate}
        style={{ flex: 1 }}
        input={{
          style: { width: '100%' },
        }}
      />
      <DatePicker
        id={id}
        name={name}
        onFocus={() => onFocus?.()}
        onBlur={() => onBlur?.()}
        placeholder="To"
        appearance="filled-darker"
        disabled={disabled}
        readOnly={readOnly}
        formatDate={(date) => (date ? dayjs(date).format('YYYY-MM-DD') : '')}
        value={to ? new Date(to) : null}
        onSelectDate={(date) => handleChangeTo(date)}
        strings={datePickerStrings}
        minDate={_minDate}
        maxDate={maxDate}
        style={{ flex: 1 }}
        input={{
          style: { width: '100%' },
        }}
      />
    </div>
  );
}
