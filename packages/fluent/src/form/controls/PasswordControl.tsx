import { Button, Input, InputProps } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';
import { useState } from 'react';

import { ControlProps } from './types';

export interface PasswordControlProps extends ControlProps<string> {
  appearance?: InputProps['appearance'];
}

export function PasswordControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  error,
  placeholder,
  disabled,
  autoFocus,
  appearance = 'filled-darker',
}: PasswordControlProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      placeholder={placeholder}
      id={id}
      name={name}
      appearance={appearance}
      type={showPassword ? 'text' : 'password'}
      autoFocus={autoFocus}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      // invalid={error}
      disabled={disabled}
      contentAfter={
        <Button
          appearance="transparent"
          size="small"
          onClick={() => setShowPassword(!showPassword)}
          icon={
            showPassword ? <Icons.EyeOff size={18} /> : <Icons.Eye size={18} />
          }
        />
      }
    />
  );
}
