import { DatePicker } from '@fluentui/react-datepicker-compat';
import dayjs from 'dayjs';

// import { useLocale } from '@react-adminapp/components';
import { ControlProps } from './types';

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

  // return (
  //   <TimePicker
  // )

  return (
    <DatePicker
      id={id}
      name={name}
      onFocus={() => onFocus?.()}
      onBlur={() => onBlur?.()}
      placeholder={placeholder}
      appearance="filled-darker"
      formatDate={(date) =>
        date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : ''
      }
      // size="sm"
      // error={error}
      // maxDate={maxDate}
      // minDate={minDate}
      disabled={disabled}
      readOnly={readOnly}
      // inputFormat={inputFormat}
      value={value ? new Date(value) : null}
      onSelectDate={(date) => onChange?.(date ? date.toISOString() : null)}
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
