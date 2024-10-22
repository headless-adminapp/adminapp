import { Dropdown, Option } from '@fluentui/react-components';
import { useMemo } from 'react';

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
  error,
  onBlur,
  onFocus,
  placeholder,
  readOnly,
}: SelectControlProps<T>) {
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
      // error={error}
      disabled={disabled}
      // readOnly={readOnly}
      // clearable
      // size="sm"
      // {...(value
      //   ? {
      //       endDecorator: (
      //         <IconButton
      //           size="sm"
      //           variant="plain"
      //           color="neutral"
      //           onMouseDown={(event) => {
      //             // don't open the popup when clicking on this button
      //             event.stopPropagation();
      //           }}
      //           onClick={() => {
      //             handleChange('');
      //             // action.current?.focusVisible();
      //           }}
      //           sx={{
      //             minHeight: '1.5rem !important',
      //             minWidth: '1.5rem !important',
      //           }}
      //         >
      //           <X size={14} />
      //         </IconButton>
      //       ),
      //       indicator: null,
      //     }
      //   : {})}
    >
      {transformedOptions.map((x) => (
        <Option key={x.value} value={x.value}>
          {x.label}
        </Option>
      ))}
    </Dropdown>
  );
}
