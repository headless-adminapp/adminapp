import { IRecentItemStore } from '@headless-adminapp/app/store';
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
  recentItemStore: IRecentItemStore;
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
  const recentItemStore = useContextSelector(
    MetadataContext,
    (state) => state.recentItemStore
  );

  const schemas = schemaStore.getAllSchema();

  return useMemo(
    () => ({
      schemas,
      schemaStore,
      appExperience,
      experienceStore,
      recentItemStore,
    }),
    [schemas, schemaStore, appExperience, experienceStore, recentItemStore]
  );
}
