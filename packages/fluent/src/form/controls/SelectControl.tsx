import { Dropdown, Option } from '@fluentui/react-components';
import { useMemo } from 'react';

import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

export interface Lookup<T = string> {
  label: string;
  value: T;
}

export interface SelectControlProps<T> extends ControlProps<T> {
  options: Lookup<T>[];
}

export default function SelectControl<T extends string | number>({
  value,
  onChange,
  options,
  id,
  name,
  disabled,
  onBlur,
  onFocus,
  placeholder,
  skeleton,
}: Readonly<SelectControlProps<T>>) {
  const transformedOptions = useMemo(
    () => options.map((x) => ({ label: x.label, value: String(x.value) })),
    [options]
  );

  const handleChange = (value: string) => {
    const option = options.find((x) => String(x.value) === value);
    if (option) {
      onChange?.(option.value);
    } else {
      onChange?.(null);
    }
  };

  const selectedOption = useMemo(
    () => options.find((x) => x.value === value),
    [options, value]
  );

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <Dropdown
      placeholder={placeholder}
      id={id}
      name={name}
      appearance="filled-darker"
      // data={transformedOptions}
      value={selectedOption?.label ?? ''}
      // onChange={(e, v) => handleChange(v as string)}
      selectedOptions={value ? [String(value)] : []}
      onOptionSelect={(event, data) => {
        handleChange(data.optionValue as string);
      }}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      style={{
        pointerEvents: disabled ? 'none' : undefined,
        width: '100%',
        minWidth: 'unset',
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
