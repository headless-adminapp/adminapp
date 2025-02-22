import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { HttpError } from '@headless-adminapp/core/transport';

import { RetriveRecordFnOptions } from './types';
import { getControls } from './utils';

export async function getRecord<
  SA extends SchemaAttributes = SchemaAttributes
>({
  recordId,
  dataService,
  form,
  schema,
  columns,
  schemaStore,
}: RetriveRecordFnOptions<SA>) {
  let record = null;

  try {
    record = await dataService.retriveRecord(
      schema.logicalName,
      recordId,
      columns
    );
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }

    throw error;
  }

  if (!record) {
    return null;
  }

  const controls = getControls(form);

  const editableGridControls = controls.filter(
    (control) => control.type === 'editablegrid'
  );

  for (const control of editableGridControls) {
    if (control.type !== 'editablegrid') {
      continue;
    }

    const controlSchema = schemaStore.getSchema(control.logicalName);

    const records = await dataService.retriveRecords<
      InferredSchemaType<SchemaAttributes>
    >({
      logicalName: controlSchema.logicalName,
      filter: {
        type: 'and',
        conditions: [
          {
            field: control.referenceAttribute,
            operator: 'eq',
            value: recordId,
          },
        ],
      },
      sort: [
        {
          field: controlSchema.createdAtAttribute ?? controlSchema.idAttribute,
          order: 'asc',
        },
      ],
      limit: 5000,
      search: '',
      columns: [
        controlSchema.idAttribute,
        control.referenceAttribute,
        ...control.attributes,
      ],
    });

    (record as any)[control.attributeName] = records.records;
  }

  return record;
}
