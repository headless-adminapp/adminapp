import {
  makeStyles,
  Popover,
  PopoverTrigger,
} from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMemo, useState } from 'react';

import { Input, PopoverSurface } from '../../../components/fluent';
import { SkeletonControl } from '../SkeletonControl';
import { ControlProps } from '../types';
import { PopoverContent } from './PopoverContent';
import { formatDateRange } from './utils';

const useStyles = makeStyles({
  input: {
    '& > input': {
      cursor: 'pointer',
    },
  },
});

export interface DateRangeControlProps extends ControlProps<[string, string]> {
  maxDate?: Date;
  minDate?: Date;
  required?: boolean;
}

export function DateRangeControl({
  value,
  onChange,
  onBlur,
  onFocus,
  disabled,
  maxDate,
  minDate,
  readOnly,
  skeleton,
  required,
}: Readonly<DateRangeControlProps>) {
  const [open, setOpen] = useState(false);
  const styles = useStyles();

  const { dateRangeFormats } = useLocale();

  const formattedValue = useMemo(() => {
    return formatDateRange(value, dateRangeFormats.short);
  }, [value, dateRangeFormats]);

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(_, data) => {
        if (readOnly || disabled) {
          return;
        }
        onFocus?.();
        setOpen(data.open);
      }}
      positioning="below-start"
    >
      <PopoverTrigger disableButtonEnhancement>
        <Input
          appearance="filled-darker"
          readOnly
          className={styles.input}
          value={formattedValue}
          onChange={() => {}}
          style={{
            width: '100%',
          }}
        />
      </PopoverTrigger>
      <PopoverSurface style={{ padding: 0 }}>
        <PopoverContent
          value={value}
          minDate={minDate}
          maxDate={maxDate}
          required={required}
          onChange={(value) => {
            setOpen(false);
            onChange?.(value);
            onBlur?.();
          }}
        />
      </PopoverSurface>
    </Popover>
  );
}
