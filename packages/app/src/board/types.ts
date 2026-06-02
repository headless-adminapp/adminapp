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

export interface ItemUpdateContext extends CommandContextBase {
  primaryControl: {
    logicalName: string;
    id: string;
    schema: Schema;
  };

  utility: UtilityContextState;
}

export interface Column {
  view: View<SchemaAttributes>;
  accept: string[];
  update?: (context: ItemUpdateContext) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BoardColumnCardPreviewFC = FC<{ record: any }>;

export interface DragItem {
  id: string;
  columnId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any;
}

export interface BoardColumnConfig {
  columnId: string;
  title: string;
  maxRecords?: number;
  filter: Filter;
  acceptSourceIds: string[]; // column ids that can be dragged from
  updateFn: (context: ItemUpdateContext) => Promise<void>;
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
}
