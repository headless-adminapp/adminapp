import type { AppExperience } from '@headless-adminapp/core/experience/app';
import type { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import type {
  ISchemaExperienceStore,
  ISchemaStore,
} from '@headless-adminapp/core/store';
import { useMemo } from 'react';

import { useContextSelector } from '../../mutable/context';
import { MetadataContext } from '../context';

interface UseMetadataResult {
  schemas: Record<string, Schema<SchemaAttributes>>;
  schemaStore: ISchemaStore<SchemaAttributes>;
  appExperience: AppExperience;
  experienceStore: ISchemaExperienceStore;
}

export function useMetadata(): UseMetadataResult {
  const schemaStore = useContextSelector(
    MetadataContext,
    (state) => state.schemaStore
  );
  const appExperience = useContextSelector(
    MetadataContext,
    (state) => state.appExperience
  );
  const experienceStore = useContextSelector(
    MetadataContext,
    (state) => state.experienceStore
  );

  const schemas = schemaStore.getAllSchema();

  return useMemo(
    () => ({
      schemas,
      schemaStore,
      appExperience,
      experienceStore,
    }),
    [schemas, schemaStore, appExperience, experienceStore]
  );
}
