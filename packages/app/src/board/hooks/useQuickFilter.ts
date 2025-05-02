import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { BoardContext } from '../context';

export function useQuickFilter() {
  const quickFilter = useContextSelector(
    BoardContext,
    (state) => state.config.quickFilter
  );

  const values = useContextSelector(
    BoardContext,
    (state) => state.quickFilterValues
  );

  const _setValue = useContextSetValue(BoardContext);

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
