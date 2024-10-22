import { Input } from '@fluentui/react-components';

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
}: CurrencyControlProps) {
  return (
    <Input
      placeholder={placeholder}
      id={id}
      autoFocus={autoFocus}
      name={name}
      value={value?.toString() ?? ''}
      onChange={(e) =>
        onChange?.(e.target.value ? Number(e.target.value) : null)
      }
      onBlur={() => onBlur?.()}
      appearance="filled-darker"
      onFocus={() => onFocus?.()}
      // invalid={error}
      // icon={<div>₹</div>}
      // startDecorator={<div>₹</div>}
      contentBefore={<div>₹</div>}
      disabled={disabled}
      readOnly={readOnly}
      style={{
        width: '100%',
      }}
      // size="sm"
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
