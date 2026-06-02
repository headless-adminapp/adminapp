import type { LocalizedDataLookup } from '@headless-adminapp/core/attributes';
import type { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import type {
  ColumnCondition,
  EntityMainGridCommandContext,
  EntitySubGridCommandContext,
  SortingState,
  View,
} from '@headless-adminapp/core/experience/view';
import { type TransformedViewColumn } from '@headless-adminapp/core/experience/view/ViewColumn';
import type {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import type {
  Filter,
  RetriveRecordsResult,
} from '@headless-adminapp/core/transport';

import { createContext } from '../mutable/context';

export { type TransformedViewColumn } from '@headless-adminapp/core/experience/view/ViewColumn';

export interface GridContextState<
  S extends SchemaAttributes = SchemaAttributes,
  CommandContext extends
    | EntityMainGridCommandContext<S>
    | EntitySubGridCommandContext = EntityMainGridCommandContext<S>,
> {
  // from props
  schema: Schema<S>;
  view: View<S>;
  viewLookup: LocalizedDataLookup[];
  onChangeView?: (viewId: string) => void;
  extraFilter?: Filter;
  commands?: CommandItemExperience<CommandContext>[][];
  maxRecords?: number;
  disabled?: boolean;

  associated?:
    | false
    | {
        logicalName: string;
        id: string;
        refAttributeName: string;
      };

  // internal state (visual and filters)
  columns: TransformedViewColumn<S>[];
  searchText: string;
  columnFilters: Partial<Record<keyof S, ColumnCondition>>;
  sorting: SortingState<Extract<keyof S, string>>;
  quickFilterValues: Record<string, unknown>;

  // internal state (selection)
  selectedIds: string[];
  cellSelectionRange?: CellSelectionRange | null;

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

export interface CellSelectionRange {
  start: {
    row: number;
    column: number;
  };
  end: {
    row: number;
    column: number;
  };
  active: boolean;
}
