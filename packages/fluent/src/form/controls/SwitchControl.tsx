import { Switch } from '@fluentui/react-components';

import { ControlProps } from './types';

export interface SwitchControlProps extends ControlProps<boolean> {}

export function SwitchControl({
  value,
  onChange,
  id,
  name,
  disabled,
  readOnly,
  onBlur,
  onFocus,
}: SwitchControlProps) {
  return (
    <Switch
      checked={value ?? false}
      onChange={(e) => onChange?.(e.currentTarget.checked)}
      id={id}
      name={name}
      disabled={disabled}
      readOnly={readOnly}
      onBlur={onBlur}
      onFocus={onFocus}
    />
  );
}
