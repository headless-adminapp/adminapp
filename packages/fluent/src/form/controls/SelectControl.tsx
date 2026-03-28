import {
  DropdownProps,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { useMemo } from 'react';

import { Dropdown } from '../../components/fluent';
import { Option } from '../../components/fluent/Option';
import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

const useStyles = makeStyles({
  root: {
    border: `${tokens.strokeWidthThin} solid ${tokens.colorTransparentStroke}`,
    backgroundColor: tokens.colorNeutralBackground3,
    cursor: 'auto',
  },
  readonly: {
    '&::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
    '&:focus-within:active::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
  },
});

export interface Lookup<T = string> {
  label: string;
  value: T;
}

export type SelectControlProps<T> = ControlProps<T> & {
  options: Lookup<T>[];
  clearable?: boolean;
  size?: DropdownProps['size'];
};

export default function SelectControl<T extends string | number>({
  value,
  onChange,
  options,
  id,
  name,
  disabled,
  readOnly,
  onBlur,
  onFocus,
  placeholder,
  skeleton,
  clearable,
  size,
}: Readonly<SelectControlProps<T>>) {
  const styles = useStyles();
  const isReadonly = disabled || readOnly;
  const transformedOptions = useMemo(
    () => options.map((x) => ({ label: x.label, value: String(x.value) })),
    [options],
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
    [options, value],
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
      // data={transformedOptions}
      value={selectedOption?.label ?? ''}
      // onChange={(e, v) => handleChange(v as string)}
      selectedOptions={value ? [String(value)] : []}
      onOptionSelect={(event, data) => {
        handleChange(data.optionValue as string);
      }}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      disabled={isReadonly}
      style={{
        width: '100%',
        minWidth: 'unset',
      }}
      className={mergeClasses(styles.root, isReadonly && styles.readonly)}
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
      button={{
        style: {
          color: tokens.colorNeutralForeground1,
          cursor: isReadonly ? 'auto' : 'pointer',
        },
        disabled: false,
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
