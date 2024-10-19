import { Form } from '@headless-adminapp/core/experience/form';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { HttpError, IDataService } from '@headless-adminapp/core/transport';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useMetadata } from '../../metadata/hooks';
import { useContextSetValue } from '../../mutable';
import { useDataService } from '../../transport';
import { DataFormContext } from '../context';
import { useDataFormSchema, useRecordId, useSelectedForm } from '../hooks';

export function getControls(form: Form) {
  const controls = form.experience.tabs
    .flatMap((tab) => tab.tabColumns)
    .flatMap((tabColumn) => tabColumn.sections)
    .flatMap((section) => section.controls);

  return controls;
}

export function getColumns(form: Form) {
  const columns = Array.from(
    new Set([
      ...(form.experience.includeAttributes ?? []),
      ...form.experience.headerControls,
      ...getControls(form)
        .filter((control) => control.type === 'standard')
        .map((control) => control.attributeName),
    ])
  );

  return columns;
}

async function getRecord({
  recordId,
  dataService,
  form,
  schema,
  columns,
  getSchema,
}: {
  recordId: string;
  dataService: IDataService;
  form: Form;
  schema: Schema;
  columns: string[];
  getSchema: (logicalName: string) => Schema;
}) {
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

    const controlSchema = getSchema(control.logicalName);

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

export function DataResolver() {
  const schema = useDataFormSchema();
  const form = useSelectedForm();

  const dataService = useDataService();
  const recordId = useRecordId();

  const { getSchema } = useMetadata();

  const setState = useContextSetValue(DataFormContext);

  const columns = useMemo(() => getColumns(form), [form]);

  const queryKey = useMemo(
    () => ['data', 'retriveRecord', schema.logicalName, recordId, columns],
    [columns, recordId, schema.logicalName]
  );

  const { data, refetch, isPending } = useQuery<any>({
    queryKey,
    queryFn: async () => {
      if (!recordId) {
        return null;
      }

      const record = getRecord({
        columns,
        dataService,
        form,
        recordId,
        schema,
        getSchema,
      });

      return record;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    setState({
      record: data,
    });
  }, [data, setState]);

  useEffect(() => {
    setState({
      dataState: {
        isFetching: isPending,
      },
    });
  }, [isPending, setState]);

  useEffect(() => {
    setState({
      refresh: async () => {
        await refetch();
      },
    });
  }, [refetch, setState]);

  return null;
}
