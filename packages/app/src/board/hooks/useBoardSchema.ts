import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useBoardConfig } from './useBoardConfig';

export function useBoardSchema<
  S extends SchemaAttributes = SchemaAttributes
>() {
  return useBoardConfig<S>().schema;
}
