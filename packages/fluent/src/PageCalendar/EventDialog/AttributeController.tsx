import { Attribute } from '@headless-adminapp/core';
import { Controller, Path, UseFormReturn } from 'react-hook-form';

import { SectionControlWrapper } from '../../DataForm/SectionControl';
import { StandardControl } from '../../PageEntityForm/StandardControl';
import { BaseFieldValues } from './types';

interface AttributeControllerProps {
  attribute: Attribute;
  attributeName: Path<BaseFieldValues>;
  form: UseFormReturn<BaseFieldValues>;
}

export function AttributeController({
  attribute,
  attributeName,
  form,
}: Readonly<AttributeControllerProps>) {
  return (
    <Controller
      control={form.control}
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
              name={attributeName as string}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorMessage={errorMessage}
              isError={isError}
              readOnly={attribute.readonly}
            />
          </SectionControlWrapper>
        );
      }}
    />
  );
}
