import { type TextareaOnChangeData, tokens } from '@fluentui/react-components';
import { useEffect, useRef } from 'react';

import { Textarea } from '../../components/fluent';
import { SkeletonControl } from './SkeletonControl';
import type { ControlProps } from './types';

const DEFAULT_MAX_HEIGHT = 260;

export interface MarkdownControlProps extends ControlProps<string> {
  rows?: number;
  autoHeight?: boolean;
  maxHeight?: number;
}

export function MarkdownControl({
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
  autoHeight,
  maxHeight,
  skeleton,
}: Readonly<MarkdownControlProps>) {
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
    data: TextareaOnChangeData,
  ) => {
    onChange?.(data.value);
  };

  if (skeleton) {
    return <SkeletonControl height={116} />;
  }

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
      style={{
        width: '100%',
      }}
      textarea={{
        style: {
          fontFamily: tokens.fontFamilyMonospace,
          fontSize: tokens.fontSizeBase200,
        },
      }}
    />
  );
}
