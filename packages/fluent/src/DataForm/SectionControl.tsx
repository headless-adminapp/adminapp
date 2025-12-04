import { Field } from '@fluentui/react-components';
import { PropsWithChildren } from 'react';

interface SectionControlWrapperProps {
  label: string;
  labelPosition?: 'top' | 'left';
  labelHidden?: boolean;
  required?: boolean;
  isError?: boolean;
  errorMessage?: string;
  grow?: boolean;
}

export function SectionControlWrapper(
  props: PropsWithChildren<SectionControlWrapperProps>
) {
  const gridTemplateRows = !props.grow
    ? undefined
    : props.labelPosition === 'top' && !props.labelHidden
    ? 'auto 1fr auto auto'
    : '1fr auto auto auto';
  return (
    <Field
      label={props.labelHidden ? undefined : props.label}
      orientation={props.labelPosition === 'top' ? 'vertical' : 'horizontal'}
      required={props.labelHidden ? undefined : props.required}
      validationState={props.isError ? 'error' : undefined}
      validationMessage={props.errorMessage}
      validationMessageIcon={null}
      style={{
        paddingLeft: props.labelHidden ? 0 : undefined,
        gridTemplateRows,
        flexGrow: props.grow ? 1 : undefined,
      }}
    >
      {props.children}
    </Field>
  );
}
