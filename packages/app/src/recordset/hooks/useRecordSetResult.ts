import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useQuery } from '@tanstack/react-query';
import { sortBy } from 'lodash';
import { useMemo } from 'react';

import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useContextSelector } from '../../mutable/context';
import { useDataService } from '../../transport';
import { RecordSetContext } from '../context';

export function useRecordSetResult() {
  const context = useContextSelector(RecordSetContext, (state) => state);

  const { schemaStore } = useMetadata();
  const dataService = useDataService();

  const schema = useMemo(() => {
    if (!context.logicalName) {
      return null;
    }

    return schemaStore.getSchema(context.logicalName);
  }, [context.logicalName]);

  const cardView = context.cardView;

  const columns = useMemo(() => {
    if (!cardView) {
      return [];
    }

    return Array.from(
      new Set([
        cardView.primaryColumn,
        cardView.avatarColumn,
        ...(cardView.secondaryColumns ?? [])
          .filter((x) => !x.expandedKey)
          .map((x) => x.name),
      ])
    ).filter(Boolean) as string[];
  }, [cardView]);

  const { isPending, data, error } = useQuery({
    queryKey: ['data', 'recordset', context.logicalName, context.ids, columns],
    queryFn: async () => {
      if (!context.logicalName || !context.ids.length || !cardView) {
        return [];
      }

      const schema = schemaStore.getSchema(context.logicalName);

      const result = await dataService.retriveRecords<SchemaAttributes>({
        logicalName: context.logicalName,
        filter: {
          type: 'and',
          conditions: [
            {
              field: schema.idAttribute as string,
              operator: 'in',
              value: context.ids,
            },
          ],
        },
        columns,
        sort: [],
        limit: context.ids.length,
      });

      const sortedData = sortBy(result.records, (x) =>
        context.ids.indexOf((x as any)[schema.idAttribute])
      );

      return sortedData;
    },
  });

  if (error) {
    console.error(error);
  }

  return {
    isLoading: isPending,
    data,
    cardView,
    schema,
  };
}
