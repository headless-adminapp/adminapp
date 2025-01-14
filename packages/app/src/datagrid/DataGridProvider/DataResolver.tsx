import {
  useClearDataExceptFirstPage,
  useRetrieveRecordsKey,
  useRetriveRecords,
} from '@headless-adminapp/app/transport/hooks/useRetriveRecords';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Data } from '@headless-adminapp/core/transport';
import { useEffect, useMemo, useRef } from 'react';

import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';
import {
  useDataGridSchema,
  useGridColumnFilter,
  useGridColumns,
  useGridExtraFilter,
  useGridSelection,
  useGridSorting,
  useMaxRecords,
  useSearchText,
  useSelectedView,
} from '../hooks';
import { collectExpandedKeys, mergeConditions } from './utils';

const MAX_RECORDS = 10000;

export function DataResolver<S extends SchemaAttributes = SchemaAttributes>() {
  const schema = useDataGridSchema();
  const view = useSelectedView();

  const [sorting] = useGridSorting();
  const [searchText] = useSearchText();
  const extraFilter = useGridExtraFilter();
  const [columnFilters] = useGridColumnFilter();
  const gridColumns = useGridColumns();
  const maxRecords = useMaxRecords() ?? MAX_RECORDS;
  const [selectedIds] = useGridSelection();

  const { schemaStore } = useMetadata();

  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

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

  const expand = useMemo(() => collectExpandedKeys(gridColumns), [gridColumns]);

  const filter = useMemo(() => {
    return mergeConditions(
      schema,
      view.experience.filter,
      extraFilter,
      columnFilters,
      schemaStore
    );
  }, [columnFilters, extraFilter, schema, schemaStore, view.experience.filter]);

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

    const selectedIds = selectedIdsRef.current.filter((x) =>
      data.records.some(
        (y) => y[schema.idAttribute as keyof Data<InferredSchemaType<S>>] === x
      )
    );

    setState({
      data,
      selectedIds,
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
