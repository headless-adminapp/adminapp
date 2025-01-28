import { InsightsContext } from '@headless-adminapp/app/insights';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useDataService } from '@headless-adminapp/app/transport';
import { WidgetContext } from '@headless-adminapp/app/widget';
import {
  DataSetItem,
  DataSetItemAllowFunction,
} from '@headless-adminapp/core/experience/insights';
import {
  AggregateAttribute,
  AggregateAttributeFunction,
  AggregateQuery,
  InferredAggregateQueryResult,
  InferredTransformedAggregateQueryResult,
} from '@headless-adminapp/core/transport';
import { useQueries } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export function useQueriesData(queries: DataSetItemAllowFunction[]) {
  const dataService = useDataService();
  const insightsState = useContextSelector(InsightsContext, (state) => state);
  const widgetState = useContextSelector(WidgetContext, (state) => state);

  const resolvedQueries = useMemo<DataSetItem[]>(() => {
    return queries.map((item) => {
      if (typeof item === 'function') {
        console.log('temp.item', item, item(insightsState, widgetState));
        return item(insightsState, widgetState);
      }

      return item;
    });
  }, [queries, insightsState, widgetState]);

  const result = useQueries({
    queries: resolvedQueries.map((item) => ({
      queryKey: ['insights', 'aggregate', item],
      queryFn: async () => {
        if (item.type === 'constant') {
          return item.value;
        }

        if (item.type === 'function') {
          return item.value(insightsState, widgetState);
        }

        if (item.type === 'customAction') {
          return dataService.customAction(
            item.value.actionName,
            item.value.payload
          );
        }

        const query = item.value;

        const data = await dataService.retriveAggregate(query);

        const transformedData = transformAggregateData(data, query);
        return transformedData;
      },
    })),
  });

  const isPending = result.some((r) => r.isPending);
  const isFetching = result.some((r) => r.isFetching);
  const refetch = () => result.map((r) => r.refetch());

  const data = useMemo(() => {
    return result.map((r) => r.data);
  }, [result]);

  return { isPending, isFetching, dataset: data, refetch };
}

function transformAggregateData(
  data: InferredAggregateQueryResult<Record<string, AggregateAttribute>>[],
  query: AggregateQuery<Record<string, AggregateAttribute>>
) {
  const transformedData =
    data as unknown as InferredTransformedAggregateQueryResult<
      typeof query.attributes
    >[];

  Object.entries(query.attributes).forEach(([key, attribute]) => {
    const transformer = getAttributeValueTransformer(attribute);

    if (transformer) {
      transformedData.forEach((item: Record<string, unknown>) => {
        item[key] = transformer(item[key]);
      });
    }
  });

  return transformedData;
}

function getAttributeValueTransformer(attribute: AggregateAttribute) {
  let transformer: ((value: unknown) => unknown) | undefined = undefined;

  if (attribute.type === 'date') {
    if (attribute.format) {
      transformer = (value) =>
        dayjs(value as string, attribute.format)
          .toDate()
          .getTime();
    } else if (attribute.value.type === 'function') {
      if (attribute.value.value === AggregateAttributeFunction.YearMonth) {
        transformer = (value) =>
          dayjs(value as string, 'YYYY-MM')
            .toDate()
            .getTime();
      }
    } else {
      transformer = (value) =>
        dayjs(value as string)
          .toDate()
          .getTime();
    }
  }

  return transformer;
}
