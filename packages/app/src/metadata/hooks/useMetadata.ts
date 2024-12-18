import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useCallback, useMemo } from 'react';

import { useContextSelector } from '../../mutable/context';
import { MetadataContext } from '../context';

export function useMetadata() {
  const schemaStore = useContextSelector(
    MetadataContext,
    (state) => state.schemaStore
  );
  const appStore = useContextSelector(
    MetadataContext,
    (state) => state.appStore
  );
  const experienceStore = useContextSelector(
    MetadataContext,
    (state) => state.experienceStore
  );
  // const schemaLoading = useContextSelector(
  //   MetadataContext,
  //   (state) => state.schemaLoading
  // );

  const schemaLoading = false;

  const schemas = schemaStore.getAllSchema();

  /*** @deprecated */
  const getSchema = useCallback(
    <S extends SchemaAttributes = SchemaAttributes>(logicalName: string) => {
      return schemaStore.getSchema<S>(logicalName);
    },
    [schemaStore]
  );

  return useMemo(
    () => ({
      schemas,
      schemaLoading,
      /*** @deprecated */
      getSchema,
      schemaStore,
      appStore,
      experienceStore,
    }),
    [schemas, schemaLoading, schemaStore, appStore, experienceStore, getSchema]
  );
}
