import type { Attribute } from '@headless-adminapp/core/attributes';
import {
  Form,
  SectionEditableGridControl,
} from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { IDataService } from '@headless-adminapp/core/transport';
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

export function getModifiedValues(
  initialValues: any,
  values: any,
  exclude?: string[]
) {
  const keys = Object.keys(values);

  return keys.reduce((p, c) => {
    if (c === '_id') {
      return p;
    }

    if (exclude && exclude.includes(c)) {
      return p;
    }

    if (
      JSON.stringify(values[c]) !== JSON.stringify((initialValues as any)[c])
    ) {
      p[c] = values[c];
    }

    return p;
  }, {} as Record<string, any>);
}

type SaveRecordResult =
  | {
      success: true;
      recordId: string;
    }
  | {
      success: false;
      title?: string;
      message: string;
      isError: boolean;
    };

export async function saveRecord({
  values,
  form,
  schema,
  dataService,
  initialValues,
  record,
  schemaStore,
}: {
  values: any;
  form: Form<SchemaAttributes>;
  record: InferredSchemaType<SchemaAttributes> | undefined;
  initialValues: Nullable<InferredSchemaType<SchemaAttributes>>;
  schema: Schema<SchemaAttributes>;
  dataService: IDataService;
  schemaStore: ISchemaStore;
}): Promise<SaveRecordResult> {
  const controls = getControls(form);

  const editableGridControls = controls.filter(
    control => control.type === 'editablegrid'
  ) as SectionEditableGridControl[];

  const modifiedValues = getModifiedValues(
    initialValues,
    values,
    editableGridControls.map(x => x.attributeName)
  );

  let recordId: string;

  if (record) {
    recordId = record[schema.idAttribute] as string;
    interface Operation {
      type: 'create' | 'update' | 'delete';
      logicalName: string;
      data?: any;
      id?: string;
    }

    const operations: Operation[] = [];

    if (Object.keys(modifiedValues).length) {
      operations.push({
        type: 'update',
        logicalName: schema.logicalName,
        data: modifiedValues,
        id: recordId,
      });
    }

    for (const control of editableGridControls) {
      const gridSchema = schemaStore.getSchema(control.logicalName);
      const gridRows = values[control.attributeName] as any[];
      const initialGridRows = (initialValues as any)[
        control.attributeName
      ] as any[];

      const newRows = gridRows.filter(x => !x[gridSchema.idAttribute]);
      const updatedRows = gridRows.filter(x => x[gridSchema.idAttribute]);
      const deletedIds = initialGridRows
        ?.map(x => x[gridSchema.idAttribute])
        .filter(id => !gridRows.find(x => x[gridSchema.idAttribute] === id));

      for (const row of newRows) {
        operations.push({
          type: 'create',
          logicalName: control.logicalName,
          data: {
            ...row,
            [control.referenceAttribute]: {
              id: recordId,
            },
          },
        });
      }

      for (const row of updatedRows) {
        const initialRow = initialGridRows.find(
          x => x[gridSchema.idAttribute] === row[gridSchema.idAttribute]
        );

        if (!initialRow) {
          throw new Error('Initial row not found');
        }

        const modifiedRow = getModifiedValues(initialRow, row);

        if (!Object.keys(modifiedRow).length) {
          continue;
        }

        operations.push({
          type: 'update',
          logicalName: control.logicalName,
          data: modifiedRow,
          id: row[gridSchema.idAttribute],
        });
      }

      for (const id of deletedIds) {
        operations.push({
          type: 'delete',
          logicalName: control.logicalName,
          id,
        });
      }
    }

    if (!operations.length) {
      return {
        success: false,
        title: 'No changes',
        message: 'No changes made to the record',
        isError: false,
      };
    }

    for (const operation of operations) {
      switch (operation.type) {
        case 'create':
          await dataService.createRecord(operation.logicalName, operation.data);
          break;
        case 'update':
          await dataService.updateRecord(
            operation.logicalName,
            operation.id!,
            operation.data
          );
          break;
        case 'delete':
          await dataService.deleteRecord(operation.logicalName, operation.id!);
      }
    }
  } else {
    const result = await dataService.createRecord(schema.logicalName, values);

    recordId = (result as any)[schema.idAttribute] as string;

    for (const control of editableGridControls) {
      const gridRows = values[control.attributeName] as any[];

      for (const row of gridRows) {
        await dataService.createRecord(control.logicalName, {
          ...row,
          [control.referenceAttribute]: {
            id: recordId,
          },
        });
      }
    }
  }

  return {
    success: true,
    recordId,
  };
}

export function getInitialValues({
  cloneRecord,
  form,
  record,
  recordId,
  defaultParameters,
}: {
  cloneRecord: InferredSchemaType<SchemaAttributes> | undefined;
  form: Form<SchemaAttributes>;
  record: InferredSchemaType<SchemaAttributes> | undefined;
  recordId: string | undefined;
  schema: Schema<SchemaAttributes>;
  defaultParameters: Record<string, any>;
}) {
  const formColumns = getColumns(form);
  const editableGridControls = getControls(form).filter(
    control => control.type === 'editablegrid'
  );

  const allColumns = [
    ...formColumns,
    ...editableGridControls.map(x => x.attributeName),
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
          .flatMap(tab => tab.tabColumns)
          .flatMap(tabColumn => tabColumn.sections)
          .flatMap(section => {
            return section.controls;
          })
          .filter(control => {
            if (control.type === 'standard') {
              const attribute = schema.attributes[control.attributeName];
              if (attribute.readonly) {
                return false;
              }
            }
            return true;
          });

        const editableGridControls = activeControls.filter(
          control => control.type === 'editablegrid'
        );

        const columns = Array.from(
          new Set([
            schema.primaryAttribute,
            ...activeControls
              .filter(control => control.type === 'standard')
              .map(control => control.attributeName),
          ])
        );

        validator = generateValidationSchema({
          editableGrids: editableGridControls.map(control => {
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

export const generateAttributeValidationSchema = memoize(
  function generateAttributeValidationSchema(
    attribute: Attribute,
    language: string,
    strings: FormValidationStringSet
  ) {
    let validationSchema: yup.Schema;

    switch (attribute.type) {
      case 'string':
        validationSchema = yup.string().nullable();
        break;
      case 'number':
        validationSchema = yup.number().nullable();
        break;
      default:
        validationSchema = yup.mixed().nullable();
        break;
    }

    const label = localizedLabel(language, attribute);

    if (attribute.required) {
      validationSchema = validationSchema.required(
        `${label}: ${strings.required}`
      );
    }

    switch (attribute.type) {
      case 'string':
        if (attribute.maxLength) {
          validationSchema = (validationSchema as yup.StringSchema).max(
            attribute.maxLength,
            `${label}: ${strings.maxLength}`
          );
        }

        if (attribute.minLength) {
          validationSchema = (validationSchema as yup.StringSchema).min(
            attribute.minLength,
            `${label}: ${strings.minLength}`
          );
        }

        if (attribute.pattern) {
          validationSchema = (validationSchema as yup.StringSchema).matches(
            new RegExp(attribute.pattern),
            `${label}: ${strings.invalidFormat}`
          );
        }

        if (attribute.format === 'email') {
          validationSchema = (validationSchema as yup.StringSchema).email(
            `${label}: ${strings.invalidEmail}`
          );
        } else if (attribute.format === 'phone') {
          validationSchema = (validationSchema as yup.StringSchema).matches(
            /^(\+\d{1,2}\s?)?\d{10}$/,
            `${label}: ${strings.invalidPhoneNumber}`
          );
        }

        break;
      default:
        break;
    }

    validationSchema = validationSchema.transform(value => {
      if (value === '') {
        return null;
      }

      return value;
    });

    return validationSchema;
  }
);
