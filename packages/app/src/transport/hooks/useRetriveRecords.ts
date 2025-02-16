import { useDataService } from '@headless-adminapp/app/transport';
import { SortingState } from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';
import {
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

const ROWS_PER_PAGE = 100;

interface UseRetriveRecordProps<S extends SchemaAttributes = SchemaAttributes> {
  schema: Schema<S>;
  search: string;
  filter: Filter | null;
  sorting: SortingState<S>;
  columns: string[];
  expand?: Partial<Record<string, string[]>>;
  maxRecords: number;
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
}: UseRetriveRecordProps<S>) {
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
    };
  }, [queryClient, queryKey]);
}

export function useRetriveRecords<
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
  }: UseRetriveRecordProps
) {
  const dataService = useDataService();

  const { data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: queryKey,
      queryFn: async (queryContext) => {
        const params: {
          pageIndex: number;
        } = queryContext.pageParam ?? {
          pageIndex: 0,
        };

        const skip = params.pageIndex * ROWS_PER_PAGE;
        const limit = Math.min(ROWS_PER_PAGE, Math.max(0, maxRecords - skip));

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

  return {
    data: finalData,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
}
