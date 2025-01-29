import { Label } from '@fluentui/react-components';
import { JSX, useCallback, useMemo } from 'react';
import { v4 as uuid } from 'uuid';

import { CurrencyControl } from './controls/CurrencyControl';
import { DateControl } from './controls/DateControl';
import { DateTimeControl } from './controls/DateTimeControl';
import { DecimalControl } from './controls/DecimalControl';
import { EmailControl } from './controls/EmailControl';
import { LookupControl } from './controls/LookupControl';
import MultiSelectControl from './controls/MultiSelectControl';
import { MultiSelectLookupControl } from './controls/MultiSelectLookupControl';
import { PasswordControl } from './controls/PasswordControl';
import SelectControl from './controls/SelectControl';
import { SwitchControl } from './controls/SwitchControl';
import { TelephoneControl } from './controls/TelephoneControl';
import { TextAreaControl } from './controls/TextAreaControl';
import { TextControl } from './controls/TextControl';
import { FormControlLoading } from './FormControlLoading';
import { FormControlProps } from './types';

function Control<T>(props: FormControlProps<T>): JSX.Element {
  const { type, label: _label, value, onChange, ...rest } = props;

  switch (type) {
    case 'custom':
      return props.renderControl({
        value: props.value,
        onChange: props.onChange,
        disabled: props.disabled,
      });
    case 'text':
      return (
        <TextControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'textarea':
      return (
        <TextAreaControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'telephone':
      return (
        <TelephoneControl
          value={value}
          onChange={onChange}
          {...(rest as any)}
        />
      );
    case 'email':
      return (
        <EmailControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'password':
      return (
        <PasswordControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'number':
      return (
        <DecimalControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'currency':
      return (
        <CurrencyControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'date':
      return (
        <DateControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'datetime':
      return (
        <DateTimeControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'select':
      return (
        <SelectControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'multi-select':
      return (
        <MultiSelectControl
          value={value}
          onChange={onChange}
          {...(rest as any)}
        />
      );
    case 'lookup':
      return (
        <LookupControl value={value} onChange={onChange} {...(rest as any)} />
      );
    case 'lookups':
      return (
        <MultiSelectLookupControl
          value={value}
          onChange={onChange}
          {...(rest as any)}
        />
      );
    case 'switch':
      return (
        <SwitchControl value={value} onChange={onChange} {...(rest as any)} />
      );
    default:
      return <div />;
  }
}

function FormControl<T>(props: FormControlProps<T>) {
  const { label, id, onChange } = props;
  const _id = useMemo(() => id ?? uuid(), [id]);

  const noop = useCallback(() => {}, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label style={{ width: 160, marginTop: 4 }}>{label}</Label>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <Control id={_id} onChange={onChange || noop} {...(props as any)} />
      </div>
    </div>
  );
}

FormControl.Loading = FormControlLoading;

export default FormControl;
