import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { RetriveRecordsResult } from '@headless-adminapp/core/transport';

import { createContext } from '../mutable';
import { BoardColumnConfig, BoardConfig } from './types';

export interface BoardContextState<
  S extends SchemaAttributes = SchemaAttributes
> {
  config: BoardConfig<S>;

  // internal state (data)
  searchText: string;
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
