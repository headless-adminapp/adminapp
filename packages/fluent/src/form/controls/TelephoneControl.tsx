import { Button, Input, tokens } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';

import { ControlProps } from './types';

export interface TelephoneControlProps extends ControlProps<string> {
  autoComplete?: string;
}

export function TelephoneControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  error,
  placeholder,
  disabled,
  autoComplete,
}: TelephoneControlProps) {
  return (
    <Input
      type="tel"
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      // invalid={error}
      disabled={disabled}
      autoComplete={autoComplete}
      style={{
        width: '100%',
        paddingRight: tokens.spacingHorizontalXS,
      }}
      // size="sm"
      contentAfter={
        !!value ? (
          <Button
            appearance="transparent"
            size="small"
            onClick={() => window.open(`tel:${value}`, '_blank')}
            icon={<Icons.Phone />}
          />
        ) : undefined
      }
    />
  );
}
