import {
  useContextSelector,
  useContextSetValue,
} from '@headless-adminapp/app/mutable/context';
import { useCallback } from 'react';

import { BoardContext } from '../context';

export function useSearchText() {
  const searchText = useContextSelector(
    BoardContext,
    (context) => context.searchText
  );

  const setValue = useContextSetValue(BoardContext);

  const setSearchText = useCallback(
    (value: string) => {
      setValue({ searchText: value });
    },
    [setValue]
  );

  return [searchText, setSearchText] as const;
}
