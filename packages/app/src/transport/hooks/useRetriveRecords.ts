import { useDataService } from '@headless-adminapp/app/transport';
import { SortingState } from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';
import {
  QueryClient,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

const ROWS_PER_PAGE = 100;
const MAX_RECORDS = 10000;

interface UseRetriveRecordProps<S extends SchemaAttributes = SchemaAttributes> {
  schema: Schema<S>;
  search?: string;
  filter?: Filter | null;
  sorting?: SortingState<S>;
  columns: (keyof S)[];
  expand?: Partial<Record<string, string[]>>;
  maxRecords?: number;
  disabled?: boolean;
}

export function useRetrieveRecordsKey<
  S extends SchemaAttributes = SchemaAttributes
>({
  schema,
  search,
  filter,
  sorting,
  columns,
  expand,
  maxRecords,
}: UseRetriveRecordProps<S>): QueryKey {
  const queryKey = useMemo(
    () => [
      'data',
      'retriveRecords',
      schema.logicalName,
      search,
      filter,
      sorting,
      columns,
      expand,
      maxRecords,
    ],
    [schema.logicalName, search, filter, sorting, columns, expand, maxRecords]
  );

  return queryKey;
}

export function useClearDataExceptFirstPage(queryKey: QueryKey) {
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      // Clear all pages except the first one when the component is unmounted
      clearDataExceptFirstPage(queryClient, queryKey);
    };
  }, [queryClient, queryKey]);
}

function clearDataExceptFirstPage(
  queryClient: QueryClient,
  queryKey: QueryKey
) {
  queryClient.setQueryData(
    queryKey,
    (oldData: { pageParams: unknown[]; pages: unknown[] }) => {
      if (!oldData) {
        return oldData;
      }

      if (!oldData.pageParams.length || !oldData.pages.length) {
        return oldData;
      }

      return {
        pageParams: [oldData.pageParams[0]],
        pages: [oldData.pages[0]],
      };
    }
  );
}

export function useRetriveRecordsInternal<
  S extends SchemaAttributes = SchemaAttributes
>(
  queryKey: QueryKey,
  {
    columns,
    expand,
    filter,
    maxRecords,
    schema,
    search,
    sorting,
    disabled,
  }: UseRetriveRecordProps<S>
) {
  const dataService = useDataService();
  const queryClient = useQueryClient();

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: queryKey,
      queryFn: async (queryContext) => {
        const params: {
          pageIndex: number;
        } = queryContext.pageParam ?? {
          pageIndex: 0,
        };

        const _maxRecords = maxRecords ?? MAX_RECORDS;

        const skip = params.pageIndex * ROWS_PER_PAGE;
        const limit = Math.min(ROWS_PER_PAGE, Math.max(0, _maxRecords - skip));

        if (limit <= 0) {
          return {
            params: params,
            data: {
              logicalName: schema.logicalName,
              count: 0,
              records: [],
            },
          };
        }

        const result = await dataService.retriveRecords<InferredSchemaType<S>>({
          logicalName: schema.logicalName,
          search,
          columns: columns as unknown as Array<keyof InferredSchemaType<S>>,
          expand,
          filter,
          skip,
          limit,
          sort: sorting as any,
        });
        return {
          params: params,
          data: result,
        };
      },
      getNextPageParam: (lastPage) => {
        if (
          lastPage.data.count <
          ROWS_PER_PAGE * (lastPage.params.pageIndex + 1)
        ) {
          return undefined;
        }

        return {
          pageIndex: lastPage.params.pageIndex + 1,
        };
      },
      initialPageParam: {
        pageIndex: 0,
      },
      enabled: !disabled,
    });

  const finalData = useMemo(() => {
    if (!data?.pages.length) {
      return null;
    }

    return {
      logicalName: data?.pages?.[0].data.logicalName,
      count: data?.pages?.[0].data.count ?? 0,
      records: data?.pages.map((x) => x.data.records).flat() ?? [],
    };
  }, [data]);

  const refech = useCallback(() => {
    clearDataExceptFirstPage(queryClient, queryKey);
    queryClient
      .resetQueries({
        queryKey,
      })
      .catch(console.error);
  }, []);

  return {
    data: finalData,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refech,
  };
}

export function useRetriveRecords<
  S extends SchemaAttributes = SchemaAttributes
>({
  columns,
  expand,
  filter,
  maxRecords,
  schema,
  search,
  sorting,
  disabled,
}: UseRetriveRecordProps<S>) {
  const queryKey = useRetrieveRecordsKey({
    columns,
    expand,
    filter,
    maxRecords,
    schema,
    search,
    sorting,
  });

  const query = useRetriveRecordsInternal(queryKey, {
    columns,
    expand,
    filter,
    maxRecords,
    schema,
    search,
    sorting,
    disabled,
  });

  return {
    ...query,
    queryKey,
  };
}
