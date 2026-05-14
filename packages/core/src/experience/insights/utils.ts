import type { SchemaAttributes } from '../../schema';
import type { InsightConfig } from './InsightConfig';

export function defineInsightConfig<
  S extends SchemaAttributes = SchemaAttributes,
>(config: InsightConfig<S>): InsightConfig<S> {
  return config;
}
