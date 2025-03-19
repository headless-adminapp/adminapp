import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { Filter } from '../../transport';
import { CommandContextBase, CommandItemExperience } from '../command';
import { ChartWidgetInfo, DataSetItemAllowFunction } from './charts';

interface BaseWidgetExperience {}

type ChartWidgetCommandItemExperience =
  CommandItemExperience<ChartWidgetCommandContext>;

type TileWidgetCommandItemExperience =
  CommandItemExperience<TileWidgetCommandContext>;

type DataGridWidgetCommandItemExperience =
  CommandItemExperience<DataGridWidgetCommandContext>;

export interface ChartWidgetCommandContext extends CommandContextBase {
  primaryControl: {
    refresh: () => void;
    updateStateValue: (value: unknown) => void;
  };
}

export interface DataGridWidgetCommandContext extends CommandContextBase {
  primaryControl: {
    refresh: () => void;
    updateStateValue: (value: unknown) => void;
  };
}

export interface TileWidgetCommandContext extends CommandContextBase {
  primaryControl: {};
}

export interface ChartWidgetExperience extends BaseWidgetExperience {
  type: 'chart';
  commands: ChartWidgetCommandItemExperience[];
  chart: ChartWidgetInfo;
}

export interface TileWidgetExperience extends BaseWidgetExperience {
  type: 'tile';
  commands: TileWidgetCommandItemExperience[];
}

export interface TableWidgetInfo<
  S extends SchemaAttributes = SchemaAttributes
> {
  attributes: SchemaAttributes;
  columns: Array<keyof S>;
}

export interface TableWidgetExperience extends BaseWidgetExperience {
  type: 'table';
  commands: ChartWidgetCommandItemExperience[];
  table: TableWidgetInfo;
}

export interface DataGridWidgetExperience extends BaseWidgetExperience {
  type: 'grid';
  logicalName: string;
  viewId?: string;
  maxRecords?: number;
  filter?: Filter;
  commands: DataGridWidgetCommandItemExperience[];
}

export interface CustomWidgetExperience extends BaseWidgetExperience {
  type: 'custom';
  commands: CommandItemExperience<unknown>[];
  Component: React.ComponentType<{ content: CustomWidgetExperience }>;
}

export type WidgetContentExperience =
  | ChartWidgetExperience
  | TileWidgetExperience
  | TableWidgetExperience
  | DataGridWidgetExperience
  | CustomWidgetExperience;
export interface WidgetExperience<
  S extends SchemaAttributes = SchemaAttributes,
  W extends WidgetContentExperience = WidgetContentExperience
> {
  title: string;
  attributes: S;
  defaultData: InferredSchemaType<S>;
  columns: number;
  rows: number;
  dataset: DataSetItemAllowFunction[];
  content: W | ((insightsState: any, widgetState: any) => W);
}

export interface WidgetState<S extends SchemaAttributes = SchemaAttributes> {
  widget: WidgetExperience<S>;
  data: InferredSchemaType<S>;
}
