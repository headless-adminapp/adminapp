import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useContextSetValue } from '../../mutable/context';
import { useDataService } from '../../transport';
import { GridContext } from '../context';
import {
  useDataGridSchema,
  useGridColumnFilter,
  useGridColumns,
  useGridExtraFilter,
  useGridSorting,
  useMaxRecords,
  useSearchText,
  useSelectedView,
} from '../hooks';
import { transformColumnFilter } from './utils';

const ROWS_PER_PAGE = 100;
const MAX_RECORDS = 10000;

function mergeConditions(
  schema: Schema,
  filter: Filter | null | undefined,
  extraFilter: Filter | null | undefined,
  columnFilters: Partial<Record<string, ColumnCondition>> | undefined,
  getSchema: (logicalName: string) => Schema
): Filter | null {
  const conditions: any[] = [];

  if (filter) {
    conditions.push(filter);
  }

  if (extraFilter) {
    conditions.push(extraFilter);
  }

  if (columnFilters) {
    const transformedColumnFilters = transformColumnFilter(
      columnFilters,
      schema,
      getSchema
    );

    if (transformedColumnFilters) {
      conditions.push({
        type: 'and',
        conditions: Object.entries(transformedColumnFilters).map(
          ([field, condition]) => {
            return {
              field,
              operator: condition!.operator,
              value: condition!.value,
              extendedKey: condition!.extendedKey,
            };
          }
        ),
      });
    }
  }

  if (conditions.length === 0) {
    return null;
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return {
    type: 'and',
    conditions,
  };
}

export function DataResolver<S extends SchemaAttributes = SchemaAttributes>() {
  const schema = useDataGridSchema();
  const view = useSelectedView();

  const dataService = useDataService();
  const [sorting] = useGridSorting();
  const [searchText] = useSearchText();
  const extraFilter = useGridExtraFilter();
  const [columnFilters] = useGridColumnFilter();
  const gridColumns = useGridColumns();
  const maxRecords = useMaxRecords() ?? MAX_RECORDS;

  const { getSchema } = useMetadata();

  const setState = useContextSetValue(GridContext);

  const [search] = useDebouncedValue(searchText, 500);

  const columns = useMemo(
    () =>
      Array.from(
        new Set([
          ...gridColumns.filter((x) => !x.expandedKey).map((x) => x.name),
          schema.primaryAttribute,
        ])
      ),
    [gridColumns, schema.primaryAttribute]
  );

  const expand = useMemo(
    () =>
      gridColumns
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
    [gridColumns]
  );

  const queryKey = useMemo(
    () => [
      'data',
      'retriveRecords',
      schema.logicalName,
      search,
      view.experience.filter,
      extraFilter,
      sorting,
      columnFilters,
      columns,
      expand,
      maxRecords,
    ],
    [
      columnFilters,
      columns,
      expand,
      extraFilter,
      schema.logicalName,
      search,
      sorting,
      view.experience.filter,
      maxRecords,
    ]
  );

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
          filter: mergeConditions(
            schema,
            view.experience.filter,
            extraFilter,
            columnFilters,
            getSchema
          ),
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
    });

  useEffect(() => {
    setState({
      fetchNextPage: fetchNextPage,
    });
  }, [fetchNextPage, setState]);

  useEffect(() => {
    if (!data?.pages.length) {
      setState({
        data: null,
      });
      return;
    }

    const finalData = {
      logicalName: data?.pages?.[0].data.logicalName,
      count: data?.pages?.[0].data.count ?? 0,
      records: data?.pages.map((x) => x.data.records).flat() ?? [],
    };
    setState({
      data: finalData,
    });
  }, [data, setState]);

  useEffect(() => {
    setState({
      dataState: {
        isFetching,
        hasNextPage,
        isFetchingNextPage,
      },
    });
  }, [hasNextPage, isFetching, isFetchingNextPage, setState]);

  return null;
}
