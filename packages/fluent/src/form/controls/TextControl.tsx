import { Input, InputProps, mergeClasses } from '@fluentui/react-components';

import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

export interface TextControlProps extends ControlProps<string> {
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
  appearance?: InputProps['appearance'];
  maxLength?: number;
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
  maxLength,
  skeleton,
}: Readonly<TextControlProps>) {
  const readonly = disabled || readOnly;

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
      placeholder={placeholder}
      id={id}
      name={name}
      autoFocus={autoFocus}
      appearance={appearance}
      value={value ?? ''}
      onChange={handleOnChange}
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
      maxLength={maxLength}
      input={{
        style: {
          width: '100%',
        },
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
