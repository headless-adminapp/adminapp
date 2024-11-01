import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useMetadata } from './useMetadata';

export function useSchema<S extends SchemaAttributes = SchemaAttributes>(
  logicalName: string
) {
  const { schemaStore } = useMetadata();

  return schemaStore.getSchema<S>(logicalName);
}
