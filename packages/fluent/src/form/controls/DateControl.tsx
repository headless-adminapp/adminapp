import { DatePicker } from '@fluentui/react-datepicker-compat';
import { useLocale } from '@headless-adminapp/app/locale';
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
}: DateControlProps) {
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
      // size="sm"
      // error={error}
      // maxDate={maxDate}
      // minDate={minDate}
      disabled={disabled}
      readOnly={readOnly}
      formatDate={(date) =>
        date ? dayjs(date).tz(timezone).format(dateFormats.short) : ''
      }
      value={value ? new Date(value) : null}
      onSelectDate={(date) =>
        onChange?.(
          date ? dayjs(date).tz(timezone).startOf('day').toISOString() : null
        )
      }
      strings={datePickerStrings}
      // inputFormat={inputFormat}
      // value={value ? new Date(value) : null}
      // onChange={(date) => onChange?.(date ? date.toISOString() : null)}
      // styles={{
      //   input: {
      //     ...(borderOnFocusOnly &&
      //       !error && {
      //         '&:not(:hover):not(:focus)': {
      //           borderColor: 'transparent',
      //           backgroundColor: 'transparent',
      //         },
      //       }),
      //   },
      //   root: {
      //     '&:not(:hover):not(:focus) .mantine-Input-rightSection': {
      //       display: 'none',
      //     },
      //     '& td': {
      //       padding: '0px !important',
      //     },
      //     '& thead tr th': {
      //       borderBottom: 'none !important',
      //     },
      //   },
      // }}
    />
  );
}
