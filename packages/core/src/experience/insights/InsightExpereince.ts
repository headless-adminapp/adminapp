import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { CommandContextBase, CommandItemExperience } from '../command';
import { FilterItem } from './FilterItem';
import { WidgetExperience } from './WidgetExperience';

export interface InsightCommandContext extends CommandContextBase {
  primaryControl: {};
}

export type InsightCommandItemExperience =
  CommandItemExperience<InsightCommandContext>;

export interface InsightExpereince<
  S extends SchemaAttributes = SchemaAttributes
> {
  title: string;
  subtitle: string;
  attributes: S;
  defaultData: InferredSchemaType<S>;
  filters: FilterItem<S>[];
  commands: InsightCommandItemExperience[];
  widgets: WidgetExperience[];
}

export interface InsightsState<S extends SchemaAttributes = SchemaAttributes> {
  experience: InsightExpereince<S>;
  data: InferredSchemaType<S>;
}
