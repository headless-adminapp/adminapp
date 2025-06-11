import { Switch } from '@fluentui/react-components';

import { SkeletonControl } from './SkeletonControl';
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
  skeleton,
}: SwitchControlProps) {
  if (skeleton) {
    return <SkeletonControl width={80} />;
  }

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
