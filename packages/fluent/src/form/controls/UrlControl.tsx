import { Button, Input, tokens } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';

import { ControlProps } from './types';

export interface UrlControlProps extends ControlProps<string> {}

export function UrlControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  placeholder,
  disabled,
}: UrlControlProps) {
  return (
    <Input
      type="url"
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
      autoComplete="off"
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
            onClick={() => window.open(value, '_blank')}
            icon={<Icons.OpenInNew />}
          />
        ) : undefined
      }
    />
  );
}
