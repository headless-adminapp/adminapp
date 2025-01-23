/* eslint-disable unused-imports/no-unused-vars */
import { SpinButton } from '@fluentui/react-components';

import { ControlProps } from './types';

export interface IntegerControlProps extends ControlProps<number> {}

export function IntegerControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  error,
  disabled,
  placeholder,
  borderOnFocusOnly,
  readOnly,
}: IntegerControlProps) {
  return (
    <SpinButton
      appearance="filled-darker"
      placeholder={placeholder}
      id={id}
      name={name}
      value={value ?? null}
      onChange={(e, data) => {
        if (data.value !== undefined) {
          onChange?.(data.value);
        } else if (!data.displayValue) {
          onChange?.(null);
        } else if (data.displayValue !== undefined) {
          const newValue = parseFloat(data.displayValue);
          if (!Number.isNaN(newValue)) {
            onChange?.(newValue);
          }
        } else {
          onChange?.(null);
        }
      }}
    />
  );
}
