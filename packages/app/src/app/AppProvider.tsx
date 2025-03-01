import { SchemaExperienceMetadata } from '@headless-adminapp/core/experience/schema';
import { useQuery } from '@tanstack/react-query';
import { FC, PropsWithChildren, useMemo } from 'react';

import { useAppExperience, useExperienceStore } from '../metadata/hooks';
import { AppContext, AppContextState } from './context';

interface AppProviderProps {}

export const AppProvider: FC<PropsWithChildren<AppProviderProps>> = ({
  children,
}) => {
  const experienceStore = useExperienceStore();
  const appExperience = useAppExperience();
  const { data: schemaMetadataList } = useQuery({
    queryKey: ['experience-schema-metadata-list'],
    queryFn: async () => {
      return experienceStore.getExperienceSchemaMetadatList();
    },
    initialData: [],
  });

  const schemaMetadataDic = useMemo(
    () =>
      schemaMetadataList?.reduce((acc, item) => {
        acc[item.logicalName] = item;
        return acc;
      }, {} as Record<string, SchemaExperienceMetadata>) ?? {},
    [schemaMetadataList]
  );

  const contextValue = useMemo(
    () => ({ appExperience, schemaMetadataDic, schemaMetadataList }),
    [appExperience, schemaMetadataDic, schemaMetadataList]
  );

  return (
    <AppContext.Provider value={contextValue as AppContextState}>
      {children}
    </AppContext.Provider>
  );
};
