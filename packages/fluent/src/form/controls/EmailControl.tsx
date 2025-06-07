import { Button, Input, tokens } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';

import { ControlProps } from './types';

export interface EmailControlProps extends ControlProps<string> {
  autoComplete?: string;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
}

export function EmailControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  autoComplete,
  textTransform,
  readOnly,
}: Readonly<EmailControlProps>) {
  return (
    <Input
      type="email"
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      // size="sm"
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
      // invalid={error}
      readOnly={disabled || readOnly}
      autoComplete={autoComplete}
      style={{
        flex: 1,
        paddingRight: tokens.spacingHorizontalXS,
        width: '100%',
      }}
      contentAfter={
        !!value ? (
          <Button
            onClick={() => window.open(`mailto:${value}`, '_blank')}
            color="primary"
            appearance="transparent"
            icon={<Icons.Mail />}
            size="small"
          />
        ) : undefined
      }
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
