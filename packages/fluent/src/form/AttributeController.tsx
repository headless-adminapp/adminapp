import { Attribute } from '@headless-adminapp/core';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { SectionControlWrapper } from '../DataForm/SectionControl';
import { StandardControl } from '../PageEntityForm/StandardControl';

interface AttributeControllerProps<
  TFieldValues extends FieldValues = FieldValues
> {
  attribute: Attribute;
  attributeName: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  readOnly?: boolean;
}

export function AttributeController<
  TFieldValues extends FieldValues = FieldValues
>({
  attribute,
  attributeName,
  control,
  readOnly,
}: Readonly<AttributeControllerProps<TFieldValues>>) {
  return (
    <Controller
      control={control}
      name={attributeName}
      render={({ field, fieldState, formState }) => {
        const isError =
          (fieldState.isTouched || formState.isSubmitted) &&
          !!fieldState.error?.message;
        const errorMessage =
          fieldState.isTouched || formState.isSubmitted
            ? fieldState.error?.message
            : '';

        return (
          <SectionControlWrapper
            label={attribute.label}
            labelPosition="left"
            required={attribute.required}
            isError={isError}
            errorMessage={errorMessage}
          >
            <StandardControl
              attribute={attribute}
              name={attributeName}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errorMessage}
              isError={isError}
              readOnly={readOnly || attribute.readonly}
            />
          </SectionControlWrapper>
        );
      }}
    />
  );
}
