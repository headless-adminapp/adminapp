import type { JSX } from 'react';

// import { AttachmentControlProps } from './controls/AttachmentControl';
import type { CurrencyControlProps } from './controls/CurrencyControl';
import type { DateControlProps } from './controls/DateControl';
import type { DateTimeControlProps } from './controls/DateTimeControl';
import type { DecimalControlProps } from './controls/DecimalControl';
import type { EmailControlProps } from './controls/EmailControl';
import type { LookupControlProps } from './controls/LookupControl';
import type { MultiSelectControlProps } from './controls/MultiSelectControl';
import type { MultiSelectLookupControlProps } from './controls/MultiSelectLookupControl';
import type { PasswordControlProps } from './controls/PasswordControl';
import type { SelectControlProps } from './controls/SelectControl';
import type { SwitchControlProps } from './controls/SwitchControl';
import type { TelephoneControlProps } from './controls/TelephoneControl';
import type { TextAreaControlProps } from './controls/TextAreaControl';
import type { TextControlProps } from './controls/TextControl';
import type { ControlProps } from './controls/types';

export interface BaseFormControlProps {
  error?: boolean;
}

export type TextFormControlProps = BaseFormControlProps &
  TextControlProps & {
    type: 'text';
  };

export type TextAreaFormControlProps = BaseFormControlProps &
  TextAreaControlProps & {
    type: 'textarea';
  };

export type TelephoneFormControlProps = BaseFormControlProps &
  TelephoneControlProps & {
    type: 'telephone';
  };

export type EmailFormControlProps = BaseFormControlProps &
  EmailControlProps & {
    type: 'email';
  };

export type PasswordFormControlProps = BaseFormControlProps &
  PasswordControlProps & {
    type: 'password';
  };

export type NumberFormControlProps = BaseFormControlProps &
  DecimalControlProps & {
    type: 'number';
  };

export type CurrencyFormControlProps = BaseFormControlProps &
  CurrencyControlProps & {
    type: 'currency';
  };

// export type DateTimeFormControlProps = BaseFormControlProps &
//   DateTimeControlProps & {
//     type: 'datetime';
//   };

export type DateFormControlProps = BaseFormControlProps &
  DateControlProps & {
    type: 'date';
  };

export type DateTimeFormControlProps = BaseFormControlProps &
  DateTimeControlProps & {
    type: 'datetime';
  };

export type LookupFormControlProps = BaseFormControlProps &
  LookupControlProps & {
    type: 'lookup';
  };

export type MultiSelectLookupsFormControlProps = BaseFormControlProps &
  MultiSelectLookupControlProps & {
    type: 'lookups';
  };

export type SelectFormControlProps<T> = BaseFormControlProps &
  SelectControlProps<T> & {
    type: 'select';
  };

export type MultiSelectFormControlProps<T> = BaseFormControlProps &
  MultiSelectControlProps<T> & {
    type: 'multi-select';
  };

export type SwitchFormControlProps = BaseFormControlProps &
  SwitchControlProps & {
    type: 'switch';
  };

// export type AttachmentFormControlProps = BaseFormControlProps &
//   AttachmentControlProps & {
//     type: 'attachment';
//   };

// export type CheckboxFormControlProps = BaseFormControlProps &
//   CheckboxControlProps & {
//     type: 'checkbox';
//   };

export type CustomFormControlProps<T> = BaseFormControlProps &
  ControlProps<T> & {
    type: 'custom';
    renderControl: ({
      value,
      onChange,
      disabled,
    }: {
      value: T | null;
      onChange?: (value: T) => void;
      disabled?: boolean;
    }) => JSX.Element;
  };

export type FormControlProps<T> = {
  label?: string;
  helperText?: false | string;
  required?: boolean;
} & (
  | CustomFormControlProps<T>
  | TextFormControlProps
  | TextAreaFormControlProps
  | TelephoneFormControlProps
  | EmailFormControlProps
  | PasswordFormControlProps
  | NumberFormControlProps
  | CurrencyFormControlProps
  | DateFormControlProps
  | DateTimeFormControlProps
  | SelectFormControlProps<T>
  | MultiSelectFormControlProps<T>
  | LookupFormControlProps
  | MultiSelectLookupsFormControlProps
  | SwitchFormControlProps
);
// | AttachmentFormControlProps
// | DateTimeFormControlProps
// | CheckboxFormControlProps
