/* eslint-disable unused-imports/no-unused-vars */
import { Input } from '@fluentui/react-components';
import { useEffect, useRef, useState } from 'react';

import { ControlProps } from './types';

export interface DecimalControlProps extends ControlProps<number> {
  decimalPlaces?: number;
}

export function DecimalControl({
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
  decimalPlaces,
}: DecimalControlProps) {
  const [internalValue, setInternalValue] = useState<string>(
    value ? value.toString() : ''
  );

  const internalValueRef = useRef(internalValue);
  internalValueRef.current = internalValue;

  useEffect(() => {
    let _value = '';
    if (typeof value === 'number') {
      _value = value.toString();
    }

    if (!_value && internalValueRef.current === '-') {
      return;
    }

    if (internalValueRef.current !== _value) {
      setInternalValue(_value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!value) {
      setInternalValue('');
      onChange?.(null);

      return;
    }

    value = value.replace(',', '');

    if (value === '-') {
      setInternalValue('-');
      onChange?.(null);

      return;
    }

    if (isNaN(Number(value))) {
      return;
    }

    if (decimalPlaces) {
      const parts = value.split('.');
      if (parts.length > 1) {
        value = `${parts[0]}.${parts[1].slice(0, decimalPlaces)}`;
      }
    }

    setInternalValue(value);
    onChange?.(Number(value));
  };

  return (
    <Input
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      value={internalValue}
      onChange={handleChange}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      disabled={disabled}
      readOnly={readOnly}
      style={{
        width: '100%',
      }}
    />
  );
}
