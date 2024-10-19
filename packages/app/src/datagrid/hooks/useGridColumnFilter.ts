import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridColumnFilter() {
  const columnFilters = useContextSelector(
    GridContext,
    (state) => state.columnFilters
  );

  const setValue = useContextSetValue(GridContext);

  const setColumnFilter = useCallback(
    (columnName: string, value: ColumnCondition | undefined) => {
      setValue((state) => ({
        columnFilters: {
          ...state.columnFilters,
          [columnName]: value,
        },
      }));
    },
    [setValue]
  );

  return [columnFilters, setColumnFilter] as const;
}
