import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useMetadata } from './useMetadata';

export function useSchema<S extends SchemaAttributes = SchemaAttributes>(
  logicalName: string
) {
  const { getSchema } = useMetadata();

  return getSchema<S>(logicalName);
}
