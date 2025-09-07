/* eslint-disable unused-imports/no-unused-vars */
import { SpinButton } from '../../components/fluent';
import { SkeletonControl } from './SkeletonControl';
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
  skeleton,
}: IntegerControlProps) {
  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <SpinButton
      appearance="filled-darker"
      placeholder={placeholder}
      id={id}
      name={name}
      value={value ?? null}
      readOnly={readOnly || disabled}
      style={{
        width: '100%',
      }}
      input={{
        style: {
          width: '100%',
        },
      }}
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
