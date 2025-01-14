import { PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable';
import { DataResolver } from './BoardColumnDataResolver';
import { BoardColumnContext, BoardColumnContextState } from './context';
import { useBoardConfig } from './hooks/useBoardConfig';
import { BoardColumnConfig } from './types';

export function invertValueMapping(
  value: Record<string, string[]>
): Record<string, string[]> {
  return Object.keys(value).reduce((acc, key) => {
    const toKeys = value[key];
    toKeys.forEach((toKey) => {
      acc[toKey] = [...(acc[toKey] || []), key];
    });

    return acc;
  }, {} as Record<string, string[]>);
}

export interface BoardColumnProviderProps {
  config: BoardColumnConfig;
}

export function BoardColumnProvider(
  props: PropsWithChildren<BoardColumnProviderProps>
) {
  const { schema } = useBoardConfig();

  const contextValue = useCreateContextStore<BoardColumnContextState>({
    config: props.config,
    data: {
      logicalName: schema.logicalName,
      records: [],
      count: 0,
    },
    dataState: {
      hasNextPage: false,
      isFetching: false,
      isFetchingNextPage: false,
    },
    fetchNextPage: () => {},
  });

  return (
    <BoardColumnContext.Provider value={contextValue}>
      <DataResolver />
      {props.children}
    </BoardColumnContext.Provider>
  );
}
