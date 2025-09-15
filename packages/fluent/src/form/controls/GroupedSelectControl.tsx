import { DropdownProps, OptionGroup, tokens } from '@fluentui/react-components';
import { useMemo } from 'react';

import { Dropdown } from '../../components/fluent';
import { Option } from '../../components/fluent/Option';
import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

export interface Lookup<T = string> {
  label: string;
  value: T;
}

export type GroupedSelectControlProps<T> = ControlProps<T> & {
  optionGroups: Array<{ label: string; options: Lookup<T>[] }>;
  clearable?: boolean;
  size?: DropdownProps['size'];
};

export default function GroupedSelectControl<T extends string | number>({
  value,
  onChange,
  optionGroups,
  id,
  name,
  disabled,
  onBlur,
  onFocus,
  placeholder,
  skeleton,
  clearable,
  size,
}: Readonly<GroupedSelectControlProps<T>>) {
  const handleChange = (value: string) => {
    const option = optionGroups
      .flatMap((group) => group.options)
      .find((x) => String(x.value) === String(value));
    if (option) {
      onChange?.(option.value);
    } else {
      onChange?.(null);
    }
  };

  const selectedOption = useMemo(
    () =>
      optionGroups
        .flatMap((group) => group.options)
        .find((x) => x.value === value),
    [optionGroups, value]
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
      size={size}
      value={selectedOption?.label ?? ''}
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
      clearable={clearable}
      clearButton={{
        style: {
          marginRight: tokens.spacingHorizontalXS,
        },
      }}
      expandIcon={{
        style: {
          marginRight: -6,
        },
      }}
    >
      {optionGroups.map((group) => (
        <OptionGroup label={group.label} key={group.label}>
          {group.options.map((option) => (
            <Option key={option.value} value={String(option.value)}>
              {option.label}
            </Option>
          ))}
        </OptionGroup>
      ))}
    </Dropdown>
  );
}
