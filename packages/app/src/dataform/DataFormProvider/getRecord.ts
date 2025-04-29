import { SectionEditableGridControl } from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { HttpError, IDataService } from '@headless-adminapp/core/transport';

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
    if (!control.alias) {
      continue;
    }

    const records = await getEditableSubgridRecords({
      dataService,
      control,
      schemaStore,
      recordId,
    });

    (record as any)[control.alias] = records;
  }

  return record;
}

export async function getEditableSubgridRecords({
  dataService,
  schemaStore,
  control,
  recordId,
}: {
  dataService: IDataService;
  schemaStore: ISchemaStore;
  control: SectionEditableGridControl<SchemaAttributes>;
  recordId: string;
}) {
  const controlSchema = schemaStore.getSchema(control.logicalName);

  const result = await dataService.retriveRecords<
    InferredSchemaType<SchemaAttributes>
  >({
    logicalName: controlSchema.logicalName,
    filter: {
      type: 'and',
      conditions: [
        {
          field: control.associatedAttribute,
          operator: 'eq',
          value: recordId,
        },
      ],
    },
    sort: control.sort ?? [
      {
        field: controlSchema.createdAtAttribute ?? controlSchema.idAttribute,
        order: 'asc',
      },
    ],
    limit: 5000,
    search: '',
    columns: [
      controlSchema.idAttribute,
      control.associatedAttribute,
      ...control.controls.map((x) =>
        typeof x === 'string' ? x : x.attributeName
      ),
    ],
  });

  return result.records;
}
