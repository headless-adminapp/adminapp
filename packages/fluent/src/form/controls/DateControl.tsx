import { DayOfWeek } from '@fluentui/react-calendar-compat';
import { tokens } from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { useLocale } from '@headless-adminapp/app/locale';
import { Icons } from '@headless-adminapp/icons';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { useAppStrings } from '../../App/AppStringContext';
import { extendedTokens } from '../../components/fluent';
import { SkeletonControl } from './SkeletonControl';
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
  skeleton,
}: Readonly<DateControlProps>) {
  const { dateFormats } = useLocale();
  const { datePickerStrings } = useAppStrings();

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <DatePicker
      id={id}
      name={name}
      onFocus={() => onFocus?.()}
      onBlur={() => onBlur?.()}
      placeholder={placeholder}
      appearance="filled-darker"
      firstDayOfWeek={DayOfWeek.Monday}
      showMonthPickerAsOverlay
      disabled={disabled}
      readOnly={readOnly}
      formatDate={(date) => (date ? dayjs(date).format(dateFormats.short) : '')}
      value={value ? new Date(value) : null}
      onSelectDate={(date) => {
        onChange?.(date ? dayjs(date).format('YYYY-MM-DD') : null);
      }}
      strings={datePickerStrings}
      style={{
        width: '100%',
        borderRadius: extendedTokens.controlBorderRadius,
        minHeight: extendedTokens.controlMinHeightM,
      }}
      input={{
        style: {
          width: '100%',
        },
      }}
      popupSurface={{
        style: {
          borderRadius: extendedTokens.paperBorderRadius,
        },
      }}
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
