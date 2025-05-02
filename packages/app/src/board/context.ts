import type {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import type { RetriveRecordsResult } from '@headless-adminapp/core/transport';

import { createContext } from '../mutable';
import { BoardColumnConfig, BoardConfig } from './types';

export interface BoardContextState<
  S extends SchemaAttributes = SchemaAttributes
> {
  config: BoardConfig<S>;

  // internal state (data)
  searchText: string;
  quickFilterValues: Record<string, unknown>;
}

export interface BoardColumnContextState<
  S extends SchemaAttributes = SchemaAttributes
> {
  config: BoardColumnConfig;

  // internal state (data)
  data: RetriveRecordsResult<InferredSchemaType<S>> | null;
  dataState: {
    isFetching: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  };
  fetchNextPage: () => void;
}

export const BoardContext = createContext<BoardContextState>();
export const BoardColumnContext = createContext<BoardColumnContextState>();
