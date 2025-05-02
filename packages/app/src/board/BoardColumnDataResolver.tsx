import { Filter } from '@headless-adminapp/core/transport';
import { useEffect, useMemo } from 'react';

import { useAuthSession } from '../auth';
import { useDebouncedValue } from '../hooks';
import { useContextSetValue } from '../mutable';
import {
  useClearDataExceptFirstPage,
  useRetriveRecords,
} from '../transport/hooks/useRetriveRecords';
import { BoardColumnContext } from './context';
import { useBoardColumnConfig } from './hooks/useBoardColumnConfig';
import { useBoardConfig } from './hooks/useBoardConfig';
import { useQuickFilter } from './hooks/useQuickFilter';
import { useSearchText } from './hooks/useSearchText';

const MAX_RECORDS = 10000;

export function DataResolver() {
  const {
    schema,
    sorting,
    projection: { columns, expand },
  } = useBoardConfig();
  const [searchText] = useSearchText();
  const [quickFilter, quickFilterValues] = useQuickFilter();
  const authSession = useAuthSession();

  const { filter, maxRecords = MAX_RECORDS } = useBoardColumnConfig();

  const setState = useContextSetValue(BoardColumnContext);

  const [search] = useDebouncedValue(searchText, 500);

  const quickFilterResults = useMemo(() => {
    if (!quickFilter) {
      return null;
    }

    if (!quickFilterValues) {
      return null;
    }

    return quickFilter.resolver(quickFilterValues, authSession);
  }, [authSession, quickFilter, quickFilterValues]);

  const mergedFilter = useMemo(() => {
    const filters: Filter[] = [];
    if (filter) {
      filters.push(filter);
    }

    if (quickFilterResults) {
      filters.push(quickFilterResults);
    }

    if (filters.length === 0) {
      return null;
    }

    if (filters.length === 1) {
      return filters[0];
    }

    return {
      type: 'and',
      filters,
    } as Filter;
  }, [filter, quickFilterResults]);

  const {
    fetchNextPage,
    data,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    queryKey,
  } = useRetriveRecords({
    columns,
    expand,
    filter: mergedFilter,
    maxRecords,
    schema,
    search,
    sorting,
  });

  useClearDataExceptFirstPage(queryKey);

  useEffect(() => {
    setState({
      fetchNextPage: () => {
        fetchNextPage().catch(console.error);
      },
    });
  }, [fetchNextPage, setState]);

  useEffect(() => {
    if (!data) {
      setState({
        data: null,
      });
      return;
    }

    setState({
      data,
    });
  }, [data, setState, schema.idAttribute]);

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
