import type { Id } from '@headless-adminapp/core';
import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridSelection() {
  const selecteIds = useContextSelector(
    GridContext,
    (state) => state.selectedIds,
  );

  const setValue = useContextSetValue(GridContext);

  const setSelectedIds = useCallback(
    (selectedIds: Id[] | ((previousIds: Id[]) => Id[])) => {
      if (typeof selectedIds === 'function') {
        setValue((state) => ({
          selectedIds: selectedIds(state.selectedIds),
        }));
      } else {
        setValue({ selectedIds });
      }
    },
    [setValue],
  );

  return [selecteIds, setSelectedIds] as const;
}
