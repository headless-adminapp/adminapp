import { useEffect } from 'react';

import { useDebouncedValue } from '../hooks';
import { useContextSetValue } from '../mutable';
import {
  useClearDataExceptFirstPage,
  useRetrieveRecordsKey,
  useRetriveRecords,
} from '../transport/hooks/useRetriveRecords';
import { BoardColumnContext } from './context';
import { useBoardColumnConfig } from './hooks/useBoardColumnConfig';
import { useBoardConfig } from './hooks/useBoardConfig';
import { useSearchText } from './hooks/useSearchText';

const MAX_RECORDS = 10000;

export function DataResolver() {
  const {
    schema,
    sorting,
    projection: { columns, expand },
  } = useBoardConfig();
  const [searchText] = useSearchText();

  const { filter, maxRecords = MAX_RECORDS } = useBoardColumnConfig();

  const setState = useContextSetValue(BoardColumnContext);

  const [search] = useDebouncedValue(searchText, 500);

  const queryKey = useRetrieveRecordsKey({
    columns,
    expand,
    filter,
    maxRecords,
    schema,
    search,
    sorting,
  });

  useClearDataExceptFirstPage(queryKey);

  const { fetchNextPage, data, hasNextPage, isFetching, isFetchingNextPage } =
    useRetriveRecords(queryKey, {
      columns,
      expand,
      filter,
      maxRecords,
      schema,
      search,
      sorting,
    });

  useEffect(() => {
    setState({
      fetchNextPage: fetchNextPage,
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
