import { SchemaAttributes } from '../../schema';
import { InsightConfig } from './InsightConfig';

export function defineInsightConfig<
  S extends SchemaAttributes = SchemaAttributes
>(config: InsightConfig<S>): InsightConfig<S> {
  return config;
}
