import { Input, InputProps, mergeClasses } from '@fluentui/react-components';

import { ControlProps } from './types';

export interface TextControlProps extends ControlProps<string> {
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
  appearance?: InputProps['appearance'];
}

export function TextControl({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  // error,
  placeholder,
  disabled,
  autoComplete,
  autoFocus,
  autoCapitalize,
  autoCorrect,
  textTransform,
  // borderOnFocusOnly,
  readOnly,
  appearance = 'filled-darker',
}: TextControlProps) {
  const readonly = disabled || readOnly;

  return (
    <Input
      placeholder={placeholder}
      id={id}
      name={name}
      autoFocus={autoFocus}
      appearance={appearance}
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
      // readOnly={readOnly || disabled}
      readOnly={readonly}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      className={mergeClasses(readonly && 'TextControl_readonly')}
      style={{
        width: '100%',
      }}
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