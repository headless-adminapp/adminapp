import { SchemaExperienceMetadata } from '@headless-adminapp/core/experience/schema';
import { useQuery } from '@tanstack/react-query';
import { FC, PropsWithChildren, useMemo } from 'react';

import { useAppStore, useExperienceStore } from '../metadata/hooks';
import { AppContext, AppContextState } from './context';

interface AppProviderProps {
  appId: string;
  loadingComponent: React.ReactNode;
  notFoundComponent: React.ReactNode;
}

export const AppProvider: FC<PropsWithChildren<AppProviderProps>> = ({
  children,
  appId,
  loadingComponent,
  notFoundComponent,
}) => {
  const experienceStore = useExperienceStore();
  const appStore = useAppStore();
  const { data: schemaMetadataList } = useQuery({
    queryKey: ['experience-schema-metadata-list'],
    queryFn: async () => {
      return experienceStore.getExperienceSchemaMetadatList();
    },
    initialData: [],
  });

  const { data: app, isLoading } = useQuery({
    queryKey: ['experience-app', appId],
    queryFn: async () => {
      return appStore.getApp(appId);
    },
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
    () => ({ app, schemaMetadataDic, schemaMetadataList }),
    [app, schemaMetadataDic, schemaMetadataList]
  );

  if (isLoading) {
    return loadingComponent;
  }

  if (!app) {
    return notFoundComponent;
  }

  return (
    <AppContext.Provider value={contextValue as AppContextState}>
      {children}
    </AppContext.Provider>
  );
};
