import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
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
import { useMemo } from 'react';

interface UseLookupDataOptions {
  dataService: IDataService;
  searchText?: string;
  schema: Schema;
  view: ViewExperience | null | undefined;
  enabled?: boolean;
}

function extractColumns(
  schema: Schema,
  view: ViewExperience | null | undefined
): string[] {
  if (!view?.card) {
    return [schema.primaryAttribute];
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

function getKey({
  schema,
  view,
  columns,
  expand,
  search,
}: {
  schema: Schema;
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
}: UseLookupDataOptions) {
  const [search] = useDebouncedValue(searchText, 500);

  const columns = useMemo(() => {
    return extractColumns(schema, view);
  }, [schema, view]);

  const expand = useMemo(
    () => extractExpand(view),
    [view?.card?.secondaryColumns]
  );

  const queryKey = useMemo(
    () =>
      getKey({
        columns,
        expand,
        schema,
        search,
        view,
      }),
    [
      columns,
      expand,
      schema.logicalName,
      search,
      view?.filter,
      view?.defaultSorting,
    ]
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

  return {
    data,
    isLoading: isFetching,
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
