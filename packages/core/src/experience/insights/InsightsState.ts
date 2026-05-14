import type { IEventManager } from '@headless-adminapp/core/store';

import type { InferredSchemaType, SchemaAttributes } from '../../schema';
import type { InsightConfig } from './InsightConfig';

export interface InsightsState<S extends SchemaAttributes = SchemaAttributes> {
  config: InsightConfig<S>;
  filterValues: InferredSchemaType<S>;
  eventManager: IEventManager;
}
