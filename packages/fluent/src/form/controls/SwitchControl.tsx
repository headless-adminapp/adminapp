import { ControlProps } from './types';

export interface SwitchControlProps extends ControlProps<boolean> {}

export function SwitchControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  error,
  disabled,
  placeholder,
  readOnly,
}: SwitchControlProps) {
  return null;
}
