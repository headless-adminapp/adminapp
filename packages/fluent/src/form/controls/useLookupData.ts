import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { ViewExperience } from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { IDataService } from '@headless-adminapp/core/transport';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

interface UseLookupDataOptions {
  dataService: IDataService;
  searchText?: string;
  schema: Schema;
  view: ViewExperience | null | undefined;
  enabled?: boolean;
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
    ).filter(Boolean);
  }, [schema.primaryAttribute, view?.card]);

  const expand = useMemo(
    () =>
      (view?.card?.secondaryColumns || [])
        .filter((x) => x.expandedKey)
        .reduce((acc, x) => {
          if (!acc[x.name]) {
            acc[x.name] = [];
          }

          if (!acc[x.name].includes(x.expandedKey!)) {
            acc[x.name].push(x.expandedKey!);
          }
          return acc;
        }, {} as Record<string, string[]>),
    [view?.card?.secondaryColumns]
  );

  const queryKey = useMemo(
    () => [
      'data',
      'retriveLookupRecords',
      schema.logicalName,
      search,
      view?.filter,
      view?.defaultSorting,
      columns,
      expand,
    ],
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
