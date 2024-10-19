import { SortingState } from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridSorting<
  S extends SchemaAttributes = SchemaAttributes
>() {
  const sorting = useContextSelector(GridContext, (state) => state.sorting);

  const setValue = useContextSetValue(GridContext);

  const setSorting = useCallback(
    (value: SortingState<S>) => {
      setValue({ sorting: value as any });
    },
    [setValue]
  );

  return [sorting, setSorting] as const;
}
