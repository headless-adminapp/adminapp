import { tokens } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { useAppStrings } from '../../App/AppStringContext';
import { ControlProps } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface DateControlProps extends ControlProps<string> {
  maxDate?: Date;
  minDate?: Date;
}

export function DateControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  readOnly,
}: Readonly<DateControlProps>) {
  const { dateFormats, timezone } = useLocale();
  const { datePickerStrings } = useAppStrings();

  return (
    <DatePicker
      id={id}
      name={name}
      onFocus={() => onFocus?.()}
      onBlur={() => onBlur?.()}
      placeholder={placeholder}
      appearance="filled-darker"
      disabled={disabled}
      readOnly={readOnly}
      formatDate={(date) =>
        date ? dayjs(date).tz(timezone).format(dateFormats.short) : ''
      }
      value={value ? new Date(value) : null}
      onSelectDate={(date) => {
        onChange?.(
          date
            ? dayjs(date).tz(timezone, true).startOf('day').toISOString()
            : null
        );
      }}
      strings={datePickerStrings}
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
    />
  );
}
