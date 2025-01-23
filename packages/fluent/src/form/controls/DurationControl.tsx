import { Combobox, makeStyles, Option } from '@fluentui/react-components';
import { FC, useEffect, useMemo, useState } from 'react';

import { ControlProps } from './types';

const useStyles = makeStyles({
  listbox: {
    maxHeight: '300px !important',
  },
});

const options = [
  { text: '1 minute', value: '1' },
  {
    text: '5 minutes',
    value: '5',
  },
  {
    text: '15 minutes',
    value: '15',
  },
  {
    text: '30 minutes',
    value: '30',
  },
  {
    text: '45 minutes',
    value: '45',
  },
  {
    text: '1 hour',
    value: '60',
  },
  {
    text: '1.5 hours',
    value: '90',
  },
  {
    text: '2 hours',
    value: '120',
  },
  {
    text: '2.5 hours',
    value: '150',
  },
  {
    text: '3 hours',
    value: '180',
  },
  {
    text: '3.5 hours',
    value: '210',
  },
  {
    text: '4 hours',
    value: '240',
  },
  {
    text: '4.5 hours',
    value: '270',
  },
  {
    text: '5 hours',
    value: '300',
  },
  {
    text: '5.5 hours',
    value: '330',
  },
  {
    text: '6 hours',
    value: '360',
  },
  {
    text: '6.5 hours',
    value: '390',
  },
  {
    text: '7 hours',
    value: '420',
  },
  {
    text: '7.5 hours',
    value: '450',
  },
  {
    text: '8 hours',
    value: '480',
  },
  {
    text: '1 day',
    value: '1440',
  },
  {
    text: '2 days',
    value: '2880',
  },
  {
    text: '3 days',
    value: '4320',
  },
];

export type DurationControlProps = ControlProps<number>;

export const DurationControl: FC<DurationControlProps> = ({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  autoFocus,
  readOnly,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterEnabled, setFilterEnabled] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    setSearchText(getDisplayValue(value));
  }, [value]);

  const filteredItems = useMemo(() => {
    if (!filterEnabled) {
      return options;
    }

    return options.filter((item) =>
      item.text.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, filterEnabled]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Combobox
        name={name}
        appearance="filled-darker"
        placeholder={placeholder}
        inputMode="search"
        style={{ width: '100%', minWidth: 'unset' }}
        listbox={{ className: styles.listbox }}
        autoComplete="off"
        readOnly={readOnly || disabled}
        value={searchText}
        disableAutoFocus
        selectedOptions={value ? [value.toString()] : []}
        onBlur={() => {
          let newValue = null;
          if (searchText) {
            newValue = resolveValue(searchText);

            if (newValue === undefined) {
              newValue = value;
            }
          }

          if (newValue !== null) {
            console.log('onBlur', newValue);
            onChange?.(newValue);
          }

          setSearchText(getDisplayValue(newValue));
          setFilterEnabled(false);
          onBlur?.();
        }}
        onFocus={onFocus}
        id={id}
        autoFocus={autoFocus}
        onChange={(e) => {
          setFilterEnabled(true);
          setSearchText(e.target.value);
        }}
        onOptionSelect={(e, item) => {
          console.log('onOptionSelect', e, item);
          if (!item.optionValue) {
            return;
          } else {
            onChange?.(Number(item.optionValue));
          }
          setSearchText('');
        }}
      >
        {filteredItems.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.text}
          </Option>
        ))}
      </Combobox>
    </div>
  );
};

function getDisplayValue(value: number | null) {
  if (!value) {
    return '';
  }

  // No decimal, if value is decimal, round to nearest whole number
  // 1 - 1 minute
  // 2-59 minutes -> 2-59 minutes
  // 90 minutes -> 1.5 hours
  // more than a day -> 1 day, 1.5 days, 2 days, etc.

  // check if value has decimal
  if (value % 1 !== 0) {
    // round to nearest whole number
    value = Math.round(value);
  }

  if (!value) {
    return '';
  }

  if (value === 1) {
    return '1 minute';
  }

  if (value < 60) {
    return `${value} minutes`;
  }

  if (value === 60) {
    return '1 hour';
  }

  if (value < 1440) {
    return `${Number((value / 60).toFixed(2))} hours`;
  }

  if (value === 1440) {
    return '1 day';
  }

  return `${Number((value / 1440).toFixed(2))} days`;
}

function resolveValue(value: string) {
  if (!value) {
    return null;
  }

  const numberValue = Number(value);

  if (!isNaN(numberValue)) {
    return numberValue;
  }

  const timeFormat = /^(\d+):[0-5][0-9]$/;

  if (timeFormat.test(value)) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const minutesFormat = /^(\d+(\.\d+)?) m/;

  if (minutesFormat.test(value)) {
    const [, minutes] = value.match(minutesFormat)!;
    return Math.floor(Number(minutes));
  }

  const hoursFormat = /^(\d+(\.\d+)?) h/;

  if (hoursFormat.test(value)) {
    const [, hours] = value.match(hoursFormat)!;
    return Math.floor(Number(hours) * 60);
  }

  const daysFormat = /^(\d+(\.\d+)?) d/;

  if (daysFormat.test(value)) {
    const [, days] = value.match(daysFormat)!;
    return Math.floor(Number(days) * 1440);
  }

  return undefined;
}
