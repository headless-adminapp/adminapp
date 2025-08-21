import { mergeFilters } from '@headless-adminapp/app/datagrid/DataGridProvider/utils';
import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { useRecentItemStore } from '@headless-adminapp/app/metadata/hooks/useRecentItemStore';
import { RecentItem } from '@headless-adminapp/app/store';
import { useRetriveRecords } from '@headless-adminapp/app/transport/hooks/useRetriveRecords';
import { Id } from '@headless-adminapp/core';
import { ViewExperience } from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import {
  IDataService,
  RetriveRecordsResult,
} from '@headless-adminapp/core/transport';
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

interface UseLookupDataOptions<S extends SchemaAttributes = SchemaAttributes> {
  dataService: IDataService;
  searchText?: string;
  schema: Schema<S>;
  view: ViewExperience | null | undefined;
  enabled?: boolean;
}

function extractColumns<S extends SchemaAttributes>(
  schema: Schema<S>,
  view: ViewExperience | null | undefined
): string[] {
  if (!view?.card) {
    return [schema.primaryAttribute as string];
  }

  return Array.from(
    new Set([
      view.card.primaryColumn,
      view.card.avatarColumn,
      ...(view.card.secondaryColumns ?? [])
        .filter((x) => !x.expandedKey)
        .map((x) => x.name),
    ])
  ).filter(Boolean) as string[];
}

function extractExpand(view: ViewExperience | null | undefined) {
  return (view?.card?.secondaryColumns || [])
    .filter((x) => x.expandedKey)
    .reduce((acc, x) => {
      if (!acc[x.name]) {
        acc[x.name] = [];
      }

      if (!acc[x.name].includes(x.expandedKey!)) {
        acc[x.name].push(x.expandedKey!);
      }
      return acc;
    }, {} as Record<string, string[]>);
}

function getKey<S extends SchemaAttributes>({
  schema,
  view,
  columns,
  expand,
  search,
}: {
  schema: Schema<S>;
  view: ViewExperience | null | undefined;
  columns: string[];
  expand: Record<string, string[]>;
  search: string | undefined;
}) {
  return [
    columns,
    expand,
    schema.logicalName,
    search,
    view?.filter,
    view?.defaultSorting,
  ];
}

export function useLookupData<S extends SchemaAttributes = SchemaAttributes>({
  schema,
  view,
  searchText,
  dataService,
  enabled,
}: UseLookupDataOptions<S>) {
  const [search] = useDebouncedValue(searchText, 500);
  const recentIds = useLookupRecentIds(
    createLookupRecentKey(schema.logicalName)
  );

  const columns = useMemo(() => {
    return extractColumns(schema, view);
  }, [schema, view]);

  const expand = useMemo(() => extractExpand(view), [view]);

  const queryKey = useMemo(
    () =>
      getKey({
        columns,
        expand,
        schema,
        search,
        view,
      }),
    [columns, expand, schema, search, view]
  );

  const { data, isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const result = await dataService.retriveRecords<InferredSchemaType<S>>({
        logicalName: schema.logicalName,
        search,
        columns: columns as unknown as Array<keyof InferredSchemaType<S>>,
        expand,
        filter: view?.filter ?? null,
        skip: 0,
        limit: 5,
        sort: view?.defaultSorting as any,
      });

      return result;
    },
    placeholderData: keepPreviousData,
    enabled: enabled ?? false,
  });

  const recentQueryFilter = useMemo(() => {
    return mergeFilters(view?.filter, {
      type: 'and',
      conditions: [
        {
          field: schema.idAttribute as string,
          operator: 'in',
          value: recentIds,
        },
      ],
    });
  }, [view?.filter, schema.idAttribute, recentIds]);

  const { data: recentData, isFetching: isRecentFetching } =
    useRetriveRecords<S>({
      columns,
      expand,
      schema,
      search,
      filter: recentQueryFilter,
      disabled: !enabled || !recentIds.length,
      sorting: view?.defaultSorting,
      maxRecords: 5,
    });

  const mergedData = useMemo(() => {
    const ids = new Set<Id>();

    const items = [];

    const idAttribute = schema.idAttribute as keyof InferredSchemaType<S>;

    if (recentData?.records) {
      for (const id of recentIds) {
        if (ids.has(id as Id)) {
          continue;
        }

        const item = recentData.records.find((x) => x[idAttribute] === id);

        if (item) {
          items.push(item);
          ids.add(item[idAttribute] as Id);
        }
      }
    }

    if (data?.records) {
      for (const item of data.records) {
        if (ids.has(item[idAttribute] as Id)) {
          continue;
        }

        ids.add(item[idAttribute] as Id);
        items.push(item);
      }
    }

    items.length = Math.min(items.length, 5);

    return {
      logicalName: schema.logicalName,
      count: items.length,
      records: items,
    } as RetriveRecordsResult<InferredSchemaType<S>>;
  }, [data, recentData, recentIds, schema.idAttribute, schema.logicalName]);

  return {
    data: mergedData,
    isLoading: isFetching || isRecentFetching,
  };
}

interface UseLookupsDataOptions {
  dataService: IDataService;
  searchText?: string;
  enabled?: boolean;
  items: Array<{
    schema: Schema;
    view: ViewExperience | null | undefined;
  }>;
}

export function useLookupDatas<T = unknown>({
  dataService,
  searchText,
  enabled,
  items,
}: UseLookupsDataOptions) {
  const [search] = useDebouncedValue(searchText, 500);

  const queries = useMemo(() => {
    return items.map((item) => {
      const columns = extractColumns(item.schema, item.view);
      const expand = extractExpand(item.view);

      const queryKey = getKey({
        schema: item.schema,
        view: item.view,
        columns,
        expand,
        search,
      });

      return {
        queryKey: queryKey,
        queryFn: async () => {
          const result = await dataService.retriveRecords({
            logicalName: item.schema.logicalName,
            search,
            columns,
            expand,
            filter: item.view?.filter ?? null,
            skip: 0,
            limit: 5,
            sort: item.view?.defaultSorting as any,
          });

          return result;
        },
        placeholderData: keepPreviousData,
        enabled: !!item.view && (enabled ?? false),
      };
    });
  }, [items, search, dataService, enabled]);

  return useQueries<RetriveRecordsResult<T>[]>({
    queries,
  });
}

export function useGetLookupView(logicalName: string, viewId?: string) {
  const { experienceStore } = useMetadata();

  const { isPending, data, error } = useQuery({
    queryKey: ['data', 'getLookupView', logicalName, viewId],
    queryFn: async () => {
      return experienceStore.getViewLookupV2(logicalName, viewId);
    },
  });

  if (error) {
    console.error(error);
  }

  return {
    isLoading: isPending,
    view: data,
  };
}

function useLookupRecentIds(cacheKey: string) {
  const store = useRecentItemStore();
  const [items, setItems] = useState<unknown[]>(
    store.getItems(cacheKey, 5).map((x) => x.value)
  );

  useEffect(() => {
    const listener = (newItems: RecentItem<unknown>[]) => {
      setItems(newItems.map((x) => x.value));
    };

    store.addListener(cacheKey, listener);

    return () => {
      store.removeListener(cacheKey, listener);
    };
  }, [store, cacheKey]);

  return items;
}

export function createLookupRecentKey(logicalName: string) {
  return `lookup-${logicalName}`;
}
