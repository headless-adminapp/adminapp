import { LocalizedDataLookup } from '@headless-adminapp/core/attributes';
import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import {
  ColumnCondition,
  EntityMainGridCommandContext,
  EntitySubGridCommandContext,
  SortingState,
  View,
  ViewColumn,
} from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import {
  Filter,
  RetriveRecordsResult,
} from '@headless-adminapp/core/transport';

import { createContext } from '../mutable/context';

export interface TransformedViewColumn<
  S extends SchemaAttributes = SchemaAttributes
> extends ViewColumn<S> {
  id: string;
  label: string;
}

export interface GridContextState<
  S extends SchemaAttributes = SchemaAttributes,
  CommandContext extends
    | EntityMainGridCommandContext
    | EntitySubGridCommandContext = EntityMainGridCommandContext
> {
  // from props
  schema: Schema<S>;
  view: View<S>;
  viewLookup: LocalizedDataLookup[];
  onChangeView: (viewId: string) => void;
  extraFilter?: Filter;
  commands: CommandItemExperience<CommandContext>[][];
  maxRecords?: number;

  // internal state (visual and filters)
  columns: TransformedViewColumn<S>[];
  searchText: string;
  columnFilters: Partial<Record<keyof S, ColumnCondition>>;
  sorting: SortingState<S>;

  // internal state (selection)
  selectedIds: string[];

  // internal state (data)
  data: RetriveRecordsResult<InferredSchemaType<S>> | null;
  dataState: {
    isFetching: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  };
  fetchNextPage: () => void;
  isSubGrid: boolean;
  allowViewSelection: boolean;
}

export const GridContext = createContext<GridContextState>();
