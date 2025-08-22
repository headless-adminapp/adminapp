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

  const replaceColumnFilters = useCallback(
    (columnFilters: Partial<Record<string, ColumnCondition>>) => {
      setValue({
        columnFilters,
      });
    },
    [setValue]
  );

  return [columnFilters, setColumnFilter, replaceColumnFilters] as const;
}
