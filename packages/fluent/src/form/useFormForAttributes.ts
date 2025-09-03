import { attributesFormValidator } from '@headless-adminapp/app/dataform';
import { useFormValidationStrings } from '@headless-adminapp/app/form';
import { useLocale } from '@headless-adminapp/app/locale';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Nullable } from '@headless-adminapp/core/types';
import { DefaultValues, useForm } from 'react-hook-form';

interface UseFormForAttributesProps<
  SA extends SchemaAttributes = SchemaAttributes
> {
  attributes: SA;
  defaultValues: Partial<Nullable<InferredSchemaType<SA>>>;
}

export function useFormForAttributes<
  SA extends SchemaAttributes = SchemaAttributes
>(props: UseFormForAttributesProps<SA>) {
  const { language, region } = useLocale();
  const formValidationStrings = useFormValidationStrings();

  const form = useForm<Nullable<InferredSchemaType<SA>>>({
    mode: 'all',
    defaultValues: props.defaultValues as DefaultValues<
      Nullable<InferredSchemaType<SA>>
    >,
    shouldUnregister: false,
    resolver: attributesFormValidator({
      attributes: props.attributes,
      language,
      strings: formValidationStrings,
      region,
    }),
  });

  return form;
}
