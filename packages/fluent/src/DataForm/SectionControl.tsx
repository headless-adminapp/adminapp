import { Field } from '@fluentui/react-components';
import { PropsWithChildren } from 'react';

interface SectionControlWrapperProps {
  label: string;
  labelPosition?: 'top' | 'left';
  labelHidden?: boolean;
  required?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export function SectionControlWrapper(
  props: PropsWithChildren<SectionControlWrapperProps>
) {
  return (
    <Field
      label={props.labelHidden ? undefined : props.label}
      orientation={props.labelPosition === 'top' ? 'vertical' : 'horizontal'}
      required={props.labelHidden ? undefined : props.required}
      validationState={props.isError ? 'error' : undefined}
      validationMessage={props.errorMessage}
      validationMessageIcon={null}
    >
      {props.children}
    </Field>
  );
}
