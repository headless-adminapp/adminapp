import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';

export function useQuickFilter() {
  const quickFilter = useContextSelector(
    GridContext,
    (state) => state.view.experience.quickFilter
  );

  const values = useContextSelector(
    GridContext,
    (state) => state.quickFilterValues
  );

  const _setValue = useContextSetValue(GridContext);

  const setValue = useCallback(
    (key: string, value: unknown) => {
      _setValue((state) => ({
        quickFilterValues: {
          ...state.quickFilterValues,
          [key]: value,
        },
      }));
    },
    [_setValue]
  );

  return [quickFilter, values, setValue] as const;
}
