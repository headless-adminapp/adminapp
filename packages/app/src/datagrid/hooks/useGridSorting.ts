import type { SortingState } from '@headless-adminapp/core/experience/view';
import type { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridSorting<
  S extends SchemaAttributes = SchemaAttributes,
>() {
  const sorting = useContextSelector(
    GridContext,
    (state) => state.sorting,
  ) as SortingState<Extract<keyof S, string>>;

  const setValue = useContextSetValue(GridContext);

  const setSorting = useCallback(
    (value: SortingState<Extract<keyof S, string>>) => {
      setValue({ sorting: value });
    },
    [setValue],
  );

  return [sorting, setSorting] as const;
}
