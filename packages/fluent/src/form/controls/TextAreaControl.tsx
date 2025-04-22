import { Textarea, TextareaOnChangeData } from '@fluentui/react-components';
import { useEffect, useRef } from 'react';

import { ControlProps } from './types';

const DEFAULT_MAX_HEIGHT = 260;

export interface TextAreaControlProps extends ControlProps<string> {
  rows?: number;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
  autoHeight?: boolean;
  maxHeight?: number;
}

export function TextAreaControl({
  value,
  onChange,
  id,
  name,
  placeholder,
  onBlur,
  onFocus,
  disabled,
  readOnly,
  rows = 5,
  textTransform,
  autoHeight,
  maxHeight,
}: TextAreaControlProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    if (autoHeight) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      textarea.style.maxHeight = maxHeight
        ? `${maxHeight}px`
        : textarea.scrollHeight + 'px';
    } else {
      textarea.style.height = '';
      textarea.style.maxHeight = maxHeight
        ? `${maxHeight}px`
        : `${DEFAULT_MAX_HEIGHT}px`;
    }
  }, [value, autoHeight, maxHeight]);

  const handleInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextareaOnChangeData
  ) => {
    let newValue = data.value;

    if (textTransform === 'uppercase') {
      newValue = newValue.toUpperCase();
    } else if (textTransform === 'lowercase') {
      newValue = newValue.toLowerCase();
    }

    onChange?.(newValue);
  };

  return (
    <Textarea
      ref={textAreaRef}
      placeholder={placeholder}
      id={id}
      appearance="filled-darker"
      name={name}
      value={value ?? ''}
      onChange={handleInput}
      onBlur={() => onBlur?.()}
      onFocus={() => onFocus?.()}
      // error={error}
      readOnly={disabled || readOnly}
      rows={rows}
    />
  );
}
