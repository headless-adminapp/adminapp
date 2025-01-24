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

import { getControls } from '../../dataform/DataFormProvider/DataResolver';

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

    if (exclude?.includes(c)) {
      return p;
    }

    if (JSON.stringify(values[c]) !== JSON.stringify(initialValues[c])) {
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

interface Operation {
  type: 'create' | 'update' | 'delete';
  logicalName: string;
  data?: any;
  id?: string;
}

async function executeOperation(
  operation: Operation,
  dataService: IDataService
) {
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

function generateSubgridUpdateOperation({
  recordId,
  control,
  schemaStore,
  values,
  initialValues,
}: {
  recordId: string;
  control: SectionEditableGridControl;
  schemaStore: ISchemaStore;
  values: any;
  initialValues: Nullable<InferredSchemaType<SchemaAttributes>>;
}): Operation[] {
  const operations: Operation[] = [];

  const gridSchema = schemaStore.getSchema(control.logicalName);
  const gridRows = values[control.attributeName] as any[];
  const initialGridRows = (initialValues as any)[
    control.attributeName
  ] as any[];

  const newRows = gridRows.filter((x) => !x[gridSchema.idAttribute]);
  const updatedRows = gridRows.filter((x) => x[gridSchema.idAttribute]);
  const deletedIds = initialGridRows
    ?.map((x) => x[gridSchema.idAttribute])
    .filter((id) => !gridRows.find((x) => x[gridSchema.idAttribute] === id));

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
      (x) => x[gridSchema.idAttribute] === row[gridSchema.idAttribute]
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

  return operations;
}

async function createRecord({
  values,
  form,
  schema,
  dataService,
}: {
  values: any;
  form: Form<SchemaAttributes>;
  schema: Schema<SchemaAttributes>;
  dataService: IDataService;
}) {
  const controls = getControls(form);

  const editableGridControls = controls.filter(
    (control) => control.type === 'editablegrid'
  );

  const result = await dataService.createRecord(schema.logicalName, values);

  const recordId = (result as any)[schema.idAttribute] as string;

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

  return recordId;
}

async function updateRecord({
  recordId,
  values,
  form,
  schema,
  dataService,
  initialValues,
  schemaStore,
}: {
  recordId: string;
  values: any;
  form: Form<SchemaAttributes>;
  initialValues: Nullable<InferredSchemaType<SchemaAttributes>>;
  schema: Schema<SchemaAttributes>;
  dataService: IDataService;
  schemaStore: ISchemaStore;
}) {
  const controls = getControls(form);

  const editableGridControls = controls.filter(
    (control) => control.type === 'editablegrid'
  );

  const modifiedValues = getModifiedValues(
    initialValues,
    values,
    editableGridControls.map((x) => x.attributeName)
  );

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
    operations.push(
      ...generateSubgridUpdateOperation({
        recordId,
        control,
        schemaStore,
        initialValues,
        values,
      })
    );
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
    await executeOperation(operation, dataService);
  }
}

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
  let recordId: string;

  if (record) {
    recordId = record[schema.idAttribute] as string;
    await updateRecord({
      recordId,
      values,
      form,
      schema,
      dataService,
      initialValues,
      schemaStore,
    });
  } else {
    recordId = await createRecord({
      dataService,
      form,
      schema,
      values,
    });
  }

  return {
    success: true,
    recordId,
  };
}
