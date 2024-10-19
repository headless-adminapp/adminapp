import { useCallback } from 'react';

import { useContextSelector, useContextSetValue } from '../../mutable/context';
import { GridContext } from '../context';

export function useSearchText() {
  const searchText = useContextSelector(
    GridContext,
    (context) => context.searchText
  );

  const setValue = useContextSetValue(GridContext);

  const setSearchText = useCallback(
    (value: string) => {
      setValue({ searchText: value });
    },
    [setValue]
  );

  return [searchText, setSearchText] as const;
}
