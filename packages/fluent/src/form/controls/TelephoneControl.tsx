import { Button, Input, tokens } from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';
import { parsePhoneNumber } from '@headless-adminapp/app/utils/phone';
import { Icons } from '@headless-adminapp/icons';
import { useEffect, useMemo, useState } from 'react';

import { SkeletonControl } from './SkeletonControl';
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
  placeholder,
  disabled,
  readOnly,
  autoComplete,
  skeleton,
}: Readonly<TelephoneControlProps>) {
  const [internalValue, setInternalValue] = useState<string>('');
  const { region } = useLocale();

  const number = useMemo(() => {
    if (!value) {
      return null;
    }

    return parsePhoneNumber(value, region);
  }, [value, region]);

  useEffect(() => {
    setInternalValue(number?.formattedInternationalValue ?? '');
  }, [number]);

  const handleChange = () => {
    const parsedPhoneNumber = parsePhoneNumber(internalValue, region);

    setInternalValue(parsedPhoneNumber.formattedInternationalValue);
    onChange?.(parsedPhoneNumber.rawValue);
  };

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <Input
      type="tel"
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      value={internalValue}
      onChange={(e) => setInternalValue?.(e.target.value)}
      onBlur={() => {
        handleChange();
        onBlur?.();
      }}
      onFocus={() => onFocus?.()}
      // invalid={error}
      readOnly={disabled || readOnly}
      autoComplete={autoComplete}
      style={{
        width: '100%',
        paddingRight: tokens.spacingHorizontalXS,
      }}
      // size="sm"
      contentAfter={
        !!number?.uri ? (
          <Button
            appearance="transparent"
            size="small"
            onClick={() => window.open(number.uri, '_blank')}
            title={number.uri}
            icon={<Icons.Phone />}
          />
        ) : undefined
      }
    />
  );
}
