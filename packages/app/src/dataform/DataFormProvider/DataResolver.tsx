import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useMetadata } from '../../metadata/hooks';
import { useContextSetValue } from '../../mutable';
import { useDataService } from '../../transport';
import { DataFormContext } from '../context';
import { useDataFormSchema, useRecordId, useSelectedForm } from '../hooks';
import { RetriveRecordFn } from './types';
import { getColumns } from './utils';

interface DataResolverProps<SA extends SchemaAttributes> {
  retriveRecordFn: RetriveRecordFn<SA>;
}

export function DataResolver<SA extends SchemaAttributes>({
  retriveRecordFn,
}: DataResolverProps<SA>) {
  const schema = useDataFormSchema<SA>();
  const form = useSelectedForm();

  const dataService = useDataService();
  const recordId = useRecordId();

  const { schemaStore } = useMetadata();

  const setState = useContextSetValue(DataFormContext);

  const columns = useMemo(() => getColumns(form, schema), [form, schema]);

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

      const record = retriveRecordFn({
        columns,
        dataService,
        form,
        recordId,
        schema,
        schemaStore,
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
