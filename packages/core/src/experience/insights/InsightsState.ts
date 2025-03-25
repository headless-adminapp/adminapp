import { IEventManager } from '@headless-adminapp/core/store';

import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { InsightConfig } from './InsightConfig';

export interface InsightsState<S extends SchemaAttributes = SchemaAttributes> {
  config: InsightConfig<S>;
  filterValues: InferredSchemaType<S>;
  eventManager: IEventManager;
}
