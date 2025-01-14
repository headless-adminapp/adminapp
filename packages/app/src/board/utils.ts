import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { BoardConfig } from './types';

export function defineBoardConfig<
  S extends SchemaAttributes = SchemaAttributes
>(config: BoardConfig<S>) {
  return config;
}
