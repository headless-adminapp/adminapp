import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Data } from '@headless-adminapp/core/transport';
import { useEffect, useMemo, useRef } from 'react';

import { useAuthSession } from '../../auth';
import { useIsMobile } from '../../hooks';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useContextSetValue } from '../../mutable/context';
import {
  useClearDataExceptFirstPage,
  useRetriveRecords,
} from '../../transport/hooks/useRetriveRecords';
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
import { useGridDisabled } from '../hooks/useGridDisabled';
import { useQuickFilter } from '../hooks/useQuickFilter';
import {
  collectCardColumns,
  collectCardExpandedKeys,
  collectExpandedKeys,
  collectGridColumns,
  mergeConditions,
} from './utils';

export function DataResolver<S extends SchemaAttributes = SchemaAttributes>() {
  const schema = useDataGridSchema();
  const view = useSelectedView();

  const [sorting] = useGridSorting();
  const [searchText] = useSearchText();
  const extraFilter = useGridExtraFilter();
  const [columnFilters] = useGridColumnFilter();
  const gridColumns = useGridColumns();
  const maxRecords = useMaxRecords();
  const [selectedIds] = useGridSelection();
  const disabled = useGridDisabled();
  const [quickFilter, quickFilterValues] = useQuickFilter();
  const authSession = useAuthSession();

  const { schemaStore } = useMetadata();

  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;

  const setState = useContextSetValue(GridContext);

  const [search] = useDebouncedValue(searchText, 500);

  const isMobile = useIsMobile();

  const columns = useMemo(
    () =>
      isMobile
        ? collectCardColumns({ cardView: view.experience.card, schema })
        : collectGridColumns({
            gridColumns,
            schema,
          }),
    [isMobile, view.experience.card, schema, gridColumns]
  );

  const expand = useMemo(
    () =>
      isMobile
        ? collectCardExpandedKeys({ cardView: view.experience.card })
        : collectExpandedKeys(gridColumns),
    [gridColumns, isMobile, view.experience.card]
  );

  const quickFilterResults = useMemo(() => {
    if (!quickFilter) {
      return null;
    }

    if (!quickFilterValues) {
      return null;
    }

    return quickFilter.resolver(quickFilterValues, authSession);
  }, [authSession, quickFilter, quickFilterValues]);

  const filter = useMemo(() => {
    return mergeConditions(
      schema,
      view.experience.filter,
      extraFilter,
      quickFilterResults,
      columnFilters,
      schemaStore
    );
  }, [
    columnFilters,
    extraFilter,
    schema,
    schemaStore,
    view.experience.filter,
    quickFilterResults,
  ]);

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
    filter,
    maxRecords,
    schema,
    search,
    sorting,
    disabled,
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
