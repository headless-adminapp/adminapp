import { Button, Input, tokens } from '@fluentui/react-components';
import { Icons } from '@headless-adminapp/icons';

import { SkeletonControl } from './SkeletonControl';
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
  skeleton,
}: Readonly<EmailControlProps>) {
  if (skeleton) {
    return <SkeletonControl />;
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (textTransform === 'uppercase') {
      value = value.toUpperCase();
    } else if (textTransform === 'lowercase') {
      value = value.toLowerCase();
    }

    onChange?.(value);
  };

  return (
    <Input
      type="email"
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      // size="sm"
      value={value ?? ''}
      onChange={handleOnChange}
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
        value ? (
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
