import { Dropdown, Option } from '@fluentui/react-components';
import { useMemo } from 'react';

import { Lookup } from './SelectControl';
import { ControlProps } from './types';

export interface MultiSelectControlProps<T> extends ControlProps<T[]> {
  options: Lookup<T>[];
}

export default function MultiSelectControl<T extends string | number>({
  value,
  onChange,
  options,
  id,
  name,
  disabled,
  onBlur,
  onFocus,
  placeholder,
}: MultiSelectControlProps<T>) {
  const transformedOptions = useMemo(
    () => options.map((x) => ({ label: x.label, value: String(x.value) })),
    [options]
  );

  const handleChange = (value: string[]) => {
    const selectedOptions = options.filter((x) =>
      value.includes(String(x.value))
    );
    onChange?.(selectedOptions.map((x) => x.value));
  };

  const selectedOptions = useMemo(
    () => options.filter((x) => value?.includes(x.value)),
    [options, value]
  );

  return (
    <Dropdown
      placeholder={placeholder}
      id={id}
      name={name}
      appearance="filled-darker"
      multiselect
      value={selectedOptions.map((x) => x.label).join(', ')}
      selectedOptions={value ? value.map(String) : []}
      onOptionSelect={(event, data) => {
        handleChange(data.selectedOptions);
      }}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      disabled={disabled}
      style={{
        width: '100%',
      }}
    >
      {transformedOptions.map((x) => (
        <Option key={x.value} value={x.value}>
          {x.label}
        </Option>
      ))}
    </Dropdown>
  );
}
