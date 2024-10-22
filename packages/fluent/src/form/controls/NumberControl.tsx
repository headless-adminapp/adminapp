import { Input } from '@fluentui/react-components';

import { ControlProps } from './types';

export interface NumberControlProps extends ControlProps<number> {}

export function NumberControl({
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
}: NumberControlProps) {
  return (
    <Input
      type="number"
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      // value={value ?? ''}
      onChange={(e) =>
        onChange?.(e.target.value ? Number(e.target.value) : null)
      }
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      // invalid={error}
      // size="sm"
      disabled={disabled}
      readOnly={readOnly}
      style={{
        width: '100%',
      }}
      // styles={{
      //   input: {
      //     ...(borderOnFocusOnly &&
      //       !error && {
      //         '&:not(:hover):not(:focus)': {
      //           borderColor: 'transparent',
      //           backgroundColor: 'transparent',
      //         },
      //       }),
      //   },
      // }}
    />
  );
}
