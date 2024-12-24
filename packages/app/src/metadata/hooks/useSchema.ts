import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useMetadata } from './useMetadata';

export function useSchema<S extends SchemaAttributes = SchemaAttributes>(
  logicalName: string
) {
  const { schemaStore } = useMetadata();

  if (!schemaStore.hasSchema(logicalName)) {
    return null;
  }

  return schemaStore.getSchema<S>(logicalName);
}
