import { Input } from '@fluentui/react-components';
import { useCurrencySymbol } from '@headless-adminapp/app/locale';
import { useEffect, useRef, useState } from 'react';

import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

export interface CurrencyControlProps extends ControlProps<number> {}

export function CurrencyControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  // error,
  disabled,
  placeholder,
  autoFocus,
  // borderOnFocusOnly,
  readOnly,
  skeleton,
}: CurrencyControlProps) {
  const symbol = useCurrencySymbol();
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

    setInternalValue(value);
    onChange?.(Number(value));
  };

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <Input
      placeholder={placeholder}
      id={id}
      autoFocus={autoFocus}
      name={name}
      value={internalValue}
      onChange={handleChange}
      onBlur={() => onBlur?.()}
      appearance="filled-darker"
      onFocus={() => onFocus?.()}
      contentBefore={<div>{symbol}</div>}
      readOnly={readOnly || disabled}
      style={{
        width: '100%',
      }}
    />
  );
}
