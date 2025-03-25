import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { WidgetInfo } from './WidgetInfo';

// export type Spacing = 'compact' | 'normal' | 'loose';
// export type Shadow = 'none' | 'normal' | 'deep';
// export type Radius = 'none' | 'normal' | 'large';

export interface InsightConfig<S extends SchemaAttributes = SchemaAttributes> {
  // id: string;
  title: string;
  subtitle: string;
  filterAttributes?: S;
  defaultFilter?: InferredSchemaType<S>;
  widgets: WidgetInfo[];
  // style?: {
  //   spacing?: Spacing;
  //   shadow?: Shadow;
  //   radius?: Radius;
  // };
}
