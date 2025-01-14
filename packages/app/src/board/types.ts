import { CommandContextBase } from '@headless-adminapp/core/experience/command';
import { SortingState, View } from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { Filter } from '@headless-adminapp/core/transport';
import { FC } from 'react';

import { UtilityContextState } from '../command';

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

export type BoardColumnCardPreviewFC = FC<{ record: any }>;

export interface DragItem {
  id: string;
  columnId: string;
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
  sorting: SortingState<S>;
  projection: {
    columns: Array<keyof S>;
    expand?: Partial<Record<keyof S, string[]>>;
  };
  columnConfigs: BoardColumnConfig[];
  PreviewComponent: BoardColumnCardPreviewFC;
}
