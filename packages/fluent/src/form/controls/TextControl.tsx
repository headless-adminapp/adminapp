import {
  Combobox,
  Input,
  InputProps,
  mergeClasses,
  Option,
} from '@fluentui/react-components';
import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata';
import { useRetriveRecords } from '@headless-adminapp/app/transport/hooks/useRetriveRecords';
import { SuggestionOptions } from '@headless-adminapp/core/attributes/StringAttribute';
import { uniq } from 'lodash';
import { FC, Fragment, useCallback, useEffect, useRef, useState } from 'react';

import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';

export function useSuggestions({
  searchText,
  readOnly,
}: {
  searchText: string;
  readOnly: boolean;
}) {
  const [debouncedSearchText] = useDebouncedValue(searchText, 500);
  const [data, setData] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [lookupEnabled, setLookupEnabled] = useState(false);

  const onData = useCallback((data: string[]) => {
    setData(data);
  }, []);

  useEffect(() => {
    if (open && !readOnly) setLookupEnabled(true);
  }, [open, readOnly]);

  return { data, open, setOpen, onData, lookupEnabled, debouncedSearchText };
}

export interface TextControlProps extends ControlProps<string> {
  autoComplete?: string;
  autoCapitalize?: string;
  autoCorrect?: string;
  textTransform?: 'capitalize' | 'uppercase' | 'lowercase' | 'none';
  appearance?: InputProps['appearance'];
  maxLength?: number;
  suggestions?: SuggestionOptions;
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
  suggestions,
}: Readonly<TextControlProps>) {
  const readonly = disabled || readOnly;

  const { data, open, setOpen, lookupEnabled, onData, debouncedSearchText } =
    useSuggestions({
      searchText: value ?? '',
      readOnly: !!readonly,
    });

  if (skeleton) {
    return <SkeletonControl />;
  }

  const handleOnChange = (value: string) => {
    if (textTransform === 'uppercase') {
      value = value.toUpperCase();
    } else if (textTransform === 'lowercase') {
      value = value.toLowerCase();
    }

    onChange?.(value);
  };

  if (suggestions) {
    return (
      <Fragment>
        <Combobox
          autoCapitalize="none"
          autoCorrect="off"
          placeholder={placeholder}
          appearance="filled-darker"
          spellCheck={false}
          autoComplete="off"
          freeform
          id={id}
          name={name}
          autoFocus={autoFocus}
          maxLength={maxLength}
          style={{ width: '100%', minWidth: 'unset' }}
          input={{ style: { width: '100%' } }}
          expandIcon={null}
          open={open && !!data.length && !readOnly}
          onOpenChange={(e, data) => {
            if (!data.open) {
              setOpen(data.open);
            }
          }}
          value={value ?? ''}
          onChange={(e) => {
            handleOnChange(e.target.value);
            setOpen(true);
          }}
          onBlur={() => onBlur?.()}
          onFocus={() => onFocus?.()}
          onOptionSelect={(e, item) => {
            onChange?.(item.optionText ?? '');
          }}
        >
          {data.map((item) => (
            <Option key={item} value={item} checkIcon={null}>
              {item}
            </Option>
          ))}
        </Combobox>
        {suggestions?.type === 'static' && (
          <StaticSuggestionLoader
            values={suggestions.values}
            disabled={!lookupEnabled}
            onData={onData}
            searchText={debouncedSearchText}
          />
        )}
        {suggestions?.type === 'dynamic' && (
          <DynamicSuggestionLoader
            entity={suggestions.entity}
            field={suggestions.field}
            disabled={!lookupEnabled}
            searchText={debouncedSearchText}
            onData={onData}
          />
        )}
      </Fragment>
    );
  }

  return (
    <Input
      placeholder={placeholder}
      id={id}
      name={name}
      autoFocus={autoFocus}
      appearance={appearance}
      value={value ?? ''}
      onChange={(e) => handleOnChange(e.target.value)}
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
    />
  );
}

export const DynamicSuggestionLoader: FC<{
  entity: string;
  field: string;
  searchText: string;
  disabled?: boolean;
  onData: (data: string[]) => void;
}> = ({ entity, field, searchText, disabled, onData }) => {
  const { schemaStore } = useMetadata();
  const schema = schemaStore.getSchema(entity);

  const { data } = useRetriveRecords({
    schema,
    columns: [field],
    disabled: disabled || !searchText,
    maxRecords: 5,
    sorting: [{ field: field, order: 'asc' }],
    filter: {
      type: 'and',
      conditions: [
        {
          field,
          operator: 'like',
          value: searchText,
        },
      ],
    },
  });

  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    if (!searchText) {
      onDataRef.current([]);
      return;
    }

    if (data) {
      onDataRef.current(
        uniq(data.records.map((item) => item[field] as string))
      );
    }
  }, [searchText, data, field]);

  return null;
};

export const StaticSuggestionLoader: FC<{
  values: string[];
  searchText: string;
  disabled?: boolean;
  onData: (data: string[]) => void;
}> = ({ values, searchText, disabled, onData }) => {
  const onDataRef = useRef(onData);
  onDataRef.current = onData;

  useEffect(() => {
    if (!searchText || disabled) {
      onDataRef.current([]);
      return;
    }

    const filtered = values.filter((item) =>
      item.toLowerCase().includes(searchText.toLowerCase())
    );
    if (filtered.length) {
      onDataRef.current(uniq(filtered));
    }
  }, [searchText, disabled, values]);

  return null;
};
