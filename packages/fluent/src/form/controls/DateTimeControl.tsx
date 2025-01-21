import { tokens } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Icons } from '@headless-adminapp/icons';
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
      value={value ? new Date(value) : null}
      onSelectDate={(date) => onChange?.(date ? date.toISOString() : null)}
      allowTextInput={true}
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
