import { createContext, useContext } from 'react';

export interface FormValidationStringSet {
  required: string;
  maxLength: string;
  minLength: string;
  invalidFormat: string;
  invalidEmail: string;
  invalidPhoneNumber: string;
  atLeastOneRowRequired: string;
}

export const defaultFormValidationStrings: FormValidationStringSet = {
  required: 'Required field must be filled in.',
  maxLength: 'Maximum length exceeded.',
  minLength: 'Minimum length not met.',
  invalidFormat: 'Invalid format.',
  invalidEmail: 'Invalid email.',
  invalidPhoneNumber: 'Invalid phone number.',
  atLeastOneRowRequired: 'At least one row required.',
};

export const FormValidationStringContext =
  createContext<FormValidationStringSet>(defaultFormValidationStrings);

export function useFormValidationStrings() {
  const context = useContext(FormValidationStringContext);

  return context;
}
