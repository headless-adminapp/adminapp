import type {
  AttachmentsAttribute,
  Attribute,
  StringAttribute,
} from '@headless-adminapp/core/attributes';
import { AttributeBase } from '@headless-adminapp/core/attributes/AttributeBase';
import { Form } from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { Nullable } from '@headless-adminapp/core/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { memoize, MemoizedFunction } from 'lodash';
import { ResolverResult } from 'react-hook-form';
import * as yup from 'yup';

import {
  getColumns,
  getControls,
} from '../../dataform/DataFormProvider/DataResolver';
import { FormValidationStringSet } from '../../form/FormValidationStringContext';
import { localizedLabel } from '../../locale/utils';

export { saveRecord } from './saveRecord';

export function getInitialValues({
  cloneRecord,
  form,
  record,
  recordId,
  schema,
  defaultParameters,
}: {
  cloneRecord: InferredSchemaType<SchemaAttributes> | undefined;
  form: Form<SchemaAttributes>;
  record: InferredSchemaType<SchemaAttributes> | undefined;
  recordId: string | undefined;
  schema: Schema<SchemaAttributes>;
  defaultParameters: Record<string, any>;
}) {
  const formColumns = getColumns(form, schema);
  const editableGridControls = getControls(form).filter(
    (control) => control.type === 'editablegrid'
  );

  const allColumns = [
    ...formColumns,
    ...editableGridControls.map((x) => x.attributeName),
  ];

  if (!recordId && !record && form.experience.cloneAttributes && cloneRecord) {
    const cloneAttributesObj = form.experience.cloneAttributes.reduce(
      (acc, item) => {
        if (typeof item === 'string') {
          acc[item] = item;
        }
        // TODO:
        //  else if (isEditableGridCloneAttribute(item)) {
        //   acc[item.attributeName] = item;
        // }

        return acc;
      },
      {} as Record<string, any>
    );

    return allColumns.reduce((acc, column) => {
      const cloneAttributeInfo = cloneAttributesObj[column] as string;
      // | EditableGridCloneAttribute; // TODO:

      let value: unknown = null;

      if (cloneAttributeInfo) {
        if (typeof cloneAttributeInfo === 'string') {
          value = cloneRecord[cloneAttributeInfo];
        }
        // else {
        //   const rows = cloneRecord[cloneAttributeInfo.attributeName] as any[];

        //   if (!rows?.length) {
        //     value = [];
        //   } else {
        //     value = rows.map((row) => {
        //       return Object.keys(row).reduce((p, c) => {
        //         if (c === '_id') {
        //           return p;
        //         }

        //         if (cloneAttributeInfo.attributes.includes(c)) {
        //           p[c] = row[c];
        //         } else {
        //           p[c] = null;
        //         }

        //         return p;
        //       }, {} as Record<string, any>);
        //     });
        //   }
        // }
      } else {
        value = defaultParameters[column] ?? null;
      }

      return {
        ...acc,
        [column]: value,
      };
    }, {} as Nullable<InferredSchemaType<SchemaAttributes>>);
  }

  return allColumns.reduce((acc, column) => {
    const value = record ? record[column] : defaultParameters[column] ?? null;
    return {
      ...acc,
      [column]: value,
    };
  }, {} as Nullable<InferredSchemaType<SchemaAttributes>>);
}

interface FormValidatorOptions<A extends SchemaAttributes = SchemaAttributes> {
  schema: Schema<A>;
  form: Form<A>;
  language: string;
  formReadOnly?: boolean;
  readonlyAttributes?: string[];
  strings: FormValidationStringSet;
  schemaStore: ISchemaStore;
}

type FormValidator = (<A extends SchemaAttributes = SchemaAttributes>(
  options: FormValidatorOptions<A>
) => (
  values: Record<string, any>,
  context: any,
  options: any
) => Promise<ResolverResult<{}>>) &
  MemoizedFunction;

export const formValidator: FormValidator = memoize(
  function formValidator<A extends SchemaAttributes = SchemaAttributes>({
    form,
    schema,
    readonlyAttributes,
    formReadOnly,
    schemaStore,
    language,
    strings,
  }: FormValidatorOptions<A>) {
    return async (values: Record<string, any>, context: any, options: any) => {
      let validator = yup.object().shape({});

      if (!formReadOnly) {
        const activeControls = form.experience.tabs
          .flatMap((tab) => tab.tabColumns)
          .flatMap((tabColumn) => tabColumn.sections)
          .flatMap((section) => {
            return section.controls;
          })
          .filter((control) => {
            if (control.type === 'standard') {
              const attribute = schema.attributes[control.attributeName];
              if (attribute.readonly) {
                return false;
              }
            }
            return true;
          });

        const editableGridControls = activeControls.filter(
          (control) => control.type === 'editablegrid'
        );

        const columns = Array.from(
          new Set([
            schema.primaryAttribute,
            ...activeControls
              .filter((control) => control.type === 'standard')
              .map((control) => control.attributeName),
          ])
        );

        validator = generateValidationSchema({
          editableGrids: editableGridControls.map((control) => {
            if (control.type !== 'editablegrid') {
              throw new Error('Invalid control type');
            }

            const schema = schemaStore.getSchema(control.logicalName);

            return {
              columns: control.attributes,
              schema: schema,
              attributeName: control.attributeName,
              required: control.required,
            };
          }),
          schema,
          columns: columns as string[],
          language,
          strings,
          readonlyAttributes,
        });
      }

      const resolver = yupResolver(validator);

      const result = await resolver(values, context, options);

      return result;
    };
  },
  ({ form, language, schema, strings, readonlyAttributes, formReadOnly }) =>
    JSON.stringify({
      schema,
      form,
      language,
      strings,
      readonlyAttributes,
      formReadOnly,
    })
);

export const generateValidationSchema = memoize(
  function generateValidationSchema<
    A extends SchemaAttributes = SchemaAttributes
  >({
    columns,
    editableGrids,
    language,
    schema,
    strings,
    readonlyAttributes,
  }: {
    schema: Schema<A>;
    columns: string[];
    readonlyAttributes?: string[];
    editableGrids:
      | Array<{
          schema: Schema;
          columns: string[];
          attributeName: string;
          required?: boolean;
        }>
      | undefined;
    language: string;
    strings: FormValidationStringSet;
  }) {
    return yup.object().shape({
      ...(columns.reduce((acc, column) => {
        if (readonlyAttributes?.includes(column)) {
          return acc;
        }

        const attribute = schema.attributes[column];

        const validationSchema = generateAttributeValidationSchema(
          attribute,
          language,
          strings
        );

        return {
          ...acc,
          [column]: validationSchema,
        };
      }, {} as Record<string, yup.Schema<any>>) as any),
      ...editableGrids?.reduce((acc, grid) => {
        let validationSchema = yup
          .array()
          .of(
            yup.object().shape({
              ...grid.columns.reduce((acc, column) => {
                const attribute = grid.schema.attributes[column];

                const validationSchema = generateAttributeValidationSchema(
                  attribute,
                  language,
                  strings
                );

                return {
                  ...acc,
                  [column]: validationSchema,
                };
              }, {} as Record<string, yup.Schema<any>>),
            })
          )
          .nullable();

        if (grid.required) {
          validationSchema = validationSchema
            .required(strings.atLeastOneRowRequired)
            .min(1, strings.atLeastOneRowRequired);
        }

        acc[grid.attributeName] = validationSchema;

        return acc;
      }, {} as Record<string, yup.Schema<any>>),
    });
  },
  ({ columns, editableGrids, language, schema, strings, readonlyAttributes }) =>
    JSON.stringify({
      schema,
      columns,
      editableGrids,
      language,
      strings,
      readonlyAttributes,
    })
);

function createAttributeValidationSchema(attribute: Attribute): yup.Schema {
  let validationSchema: yup.Schema;

  switch (attribute.type) {
    case 'string':
      validationSchema = yup.string().nullable();
      break;
    case 'number':
      validationSchema = yup.number().nullable();
      break;
    case 'attachments':
    case 'choices':
    case 'lookups':
      validationSchema = yup.array().nullable();
      break;
    default:
      validationSchema = yup.mixed().nullable();
      break;
  }

  return validationSchema;
}

function extendAttributeRequiredValidationSchema({
  attribute,
  validationSchema,
  label,
  strings,
}: {
  attribute: AttributeBase;
  validationSchema: yup.Schema;
  strings: FormValidationStringSet;
  label: string;
}): yup.Schema {
  if (attribute.required) {
    validationSchema = validationSchema.required(
      `${label}: ${strings.required}`
    );
  }

  return validationSchema;
}

function extendAttributeValidationSchema({
  attribute,
  validationSchema,
  label,
  strings,
}: {
  attribute: Attribute;
  validationSchema: yup.Schema;
  strings: FormValidationStringSet;
  label: string;
}): yup.Schema {
  switch (attribute.type) {
    case 'string':
      validationSchema = extendAttributeStringValidationSchema({
        attribute,
        validationSchema: validationSchema as yup.StringSchema,
        label,
        strings,
      });

      break;
    case 'attachments':
      validationSchema = extendAttributeAttachmentsValidationSchema({
        attribute,
        validationSchema: validationSchema as yup.ArraySchema<any, any>,
        label,
        strings,
      });
      break;
    default:
      break;
  }

  return validationSchema;
}

function extendAttributeStringValidationSchema({
  attribute,
  validationSchema,
  label,
  strings,
}: {
  attribute: StringAttribute;
  validationSchema: yup.StringSchema;
  strings: FormValidationStringSet;
  label: string;
}): yup.Schema {
  if (attribute.maxLength) {
    // extend the validation schema with the max length
    validationSchema = validationSchema.max(
      attribute.maxLength,
      `${label}: ${strings.maxLength}`
    );
  }

  if (attribute.minLength) {
    // extend the validation schema with the min length
    validationSchema = validationSchema.min(
      attribute.minLength,
      `${label}: ${strings.minLength}`
    );
  }

  if (attribute.pattern) {
    // extend the validation schema with the pattern
    validationSchema = validationSchema.matches(
      new RegExp(attribute.pattern),
      `${label}: ${strings.invalidFormat}`
    );
  }

  if (attribute.format === 'email') {
    // extend the validation schema with the email format
    validationSchema = validationSchema.email(
      `${label}: ${strings.invalidEmail}`
    );
  } else if (attribute.format === 'phone') {
    // extend the validation schema with the phone format
    validationSchema = validationSchema.matches(
      /^(\+\d{1,2}\s?)?\d{10}$/,
      `${label}: ${strings.invalidPhoneNumber}`
    );
  }

  return validationSchema;
}

function extendAttributeAttachmentsValidationSchema({
  attribute,
  validationSchema,
  label,
  strings,
}: {
  attribute: AttachmentsAttribute;
  validationSchema: yup.ArraySchema<any, any>;
  strings: FormValidationStringSet;
  label: string;
}): yup.Schema {
  if (attribute.required) {
    // extend the validation schema with the min length
    validationSchema = validationSchema.min(1, `${label}: ${strings.required}`);
  }

  if (attribute.maxSize) {
    // extend the validation schema with the max size
    validationSchema = validationSchema.test(
      'fileSize',
      `${label}: ${strings.fileSizeExceeded}`,
      (value) => {
        if (!value) {
          return true;
        }

        return value.every(
          (file: any) => file?.size && file.size <= attribute.maxSize!
        );
      }
    );
  }

  return validationSchema;
}

export const generateAttributeValidationSchema = memoize(
  function generateAttributeValidationSchema(
    attribute: Attribute,
    language: string,
    strings: FormValidationStringSet
  ) {
    let validationSchema = createAttributeValidationSchema(attribute);

    const label = localizedLabel(language, attribute);

    validationSchema = extendAttributeRequiredValidationSchema({
      attribute,
      validationSchema,
      label,
      strings,
    });

    validationSchema = extendAttributeValidationSchema({
      attribute,
      validationSchema,
      label,
      strings,
    });

    validationSchema = validationSchema.transform((value) => {
      if (value === '') {
        return null;
      }

      return value;
    });

    return validationSchema;
  }
);
