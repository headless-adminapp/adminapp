import { Textarea } from '@fluentui/react-components';

import { ControlProps } from './types';

export interface TextAreaControlProps extends ControlProps<string> {
  rows?: number;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
}

export function TextAreaControl({
  value,
  onChange,
  id,
  name,
  placeholder,
  onBlur,
  onFocus,
  disabled,
  readOnly,
  rows = 5,
  textTransform,
}: TextAreaControlProps) {
  return (
    <Textarea
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      value={value || ''}
      onChange={(e) => {
        textTransform === 'uppercase'
          ? onChange?.(e.target.value.toUpperCase())
          : textTransform === 'lowercase'
          ? onChange?.(e.target.value.toLowerCase())
          : onChange?.(e.target.value);
      }}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      // error={error}
      readOnly={disabled || readOnly}
      rows={rows}
    />
  );
}
