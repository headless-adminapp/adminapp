import type { CommandContextBase } from '@headless-adminapp/core/experience/command';
import type {
  SortingState,
  View,
} from '@headless-adminapp/core/experience/view';
import type { QuickFilter } from '@headless-adminapp/core/experience/view/QuickFilter';
import type { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import type { Filter } from '@headless-adminapp/core/transport';
import type { FC } from 'react';

import type { UtilityContextState } from '../command';
import type { ColumnLaneTransition } from './ColumnLaneTransition';

type RecordItem = any; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface ItemUpdateContext extends CommandContextBase {
  primaryControl: {
    logicalName: string;
    id: string;
    schema: Schema;
    record: RecordItem;
  };
  lane: {
    columnId: string;
    laneId: string;
  };
  utility: UtilityContextState;
}

export type LaneUpdateFunction = (context: ItemUpdateContext) => Promise<void>;
export type LaneResolverFunction = (record: RecordItem) => string;

export interface Column {
  view: View<SchemaAttributes>;
  accept: string[];
  update?: LaneUpdateFunction;
}

export type BoardColumnCardPreviewFC = FC<{ record: RecordItem }>;

export interface DragItem {
  id: string;
  columnId: string;
  laneId: string;
  record: RecordItem;
}

export interface BoardColumnLaneConfig {
  id: string;
  title: string;
  updateFn: LaneUpdateFunction;
}

export interface BoardColumnConfig {
  columnId: string;
  title: string;
  maxRecords?: number;
  filter: Filter;
  laneResolver: LaneResolverFunction;
  lanes: BoardColumnLaneConfig[];
}

export interface BoardConfig<S extends SchemaAttributes = SchemaAttributes> {
  title: string;
  description: string;
  schema: Schema<S>;
  sorting: SortingState<Extract<keyof S, string>>;
  projection: {
    columns: Array<keyof S>;
    expand?: Partial<Record<keyof S, string[]>>;
  };
  columnConfigs: BoardColumnConfig[];
  PreviewComponent: BoardColumnCardPreviewFC;
  HeaderComponent?: FC;
  emptyMessage?: string;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  quickFilter?: QuickFilter;
  transition: ColumnLaneTransition;
}
