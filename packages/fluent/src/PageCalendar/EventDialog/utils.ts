import { generateAttributeValidationSchema } from '@headless-adminapp/app/dataform/utils';
import { FormValidationStringSet } from '@headless-adminapp/app/form';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { memoize } from 'lodash';
import * as yup from 'yup';

// TODO: refactor duplicate code

export const formValidator = memoize(
  function formValidator<A extends SchemaAttributes = SchemaAttributes>({
    attributes,
    language,
    strings,
    region,
  }: {
    attributes: A;
    language: string;
    strings: FormValidationStringSet;
    region: string;
  }) {
    return async (values: Record<string, any>, context: any, options: any) => {
      const validator = generateValidationSchema({
        attributes,
        language,
        strings,
        region,
      });

      const resolver = yupResolver(validator);

      const result = await resolver(values, context, options);

      return result;
    };
  },
  (options) => JSON.stringify(options)
);

export const generateValidationSchema = memoize(
  function generateValidationSchema<
    A extends SchemaAttributes = SchemaAttributes
  >({
    attributes,
    language,
    strings,
    region,
  }: {
    attributes: A;
    language: string;
    strings: FormValidationStringSet;
    region: string;
  }) {
    const columns = Object.keys(attributes);
    return yup.object().shape({
      ...(columns.reduce((acc, column) => {
        const attribute = attributes[column];

        const validationSchema = generateAttributeValidationSchema(
          attribute,
          language,
          strings,
          region
        );

        return {
          ...acc,
          [column]: validationSchema,
        };
      }, {} as Record<string, yup.Schema<any>>) as any),
    });
  },
  (options) => JSON.stringify(options)
);
