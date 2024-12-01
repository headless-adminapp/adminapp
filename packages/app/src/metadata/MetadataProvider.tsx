import { PageType } from '@headless-adminapp/core/experience/app';
import {
  IClientAppStore,
  ISchemaExperienceStore,
  ISchemaStore,
  SchemaStore,
} from '@headless-adminapp/core/store';
import { IconPlaceholder } from '@headless-adminapp/icons';
import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import { ClientAppStore, SchemaExperienceStore } from '../store';
import { MetadataContext, MetadataContextState } from './context';

export interface MetadataProviderProps {
  schemaStore?: ISchemaStore;
  experienceStore?: ISchemaExperienceStore;
  appStore?: IClientAppStore;
}

export const defaultAppStore = new ClientAppStore();
export const defaultSchemaStore = new SchemaStore();
export const defaultExperienceStore = new SchemaExperienceStore({
  schemaStore: defaultSchemaStore,
});

defaultAppStore.register({
  id: 'default',
  title: 'Demo App',
  navItems: [],
  defaultPage: {
    label: 'Home',
    link: '/home',
    type: PageType.Custom,
    icon: IconPlaceholder,
  },
  logo: {},
});

export const MetadataProvider: FC<PropsWithChildren<MetadataProviderProps>> = ({
  children,
  experienceStore = defaultExperienceStore,
  schemaStore = defaultSchemaStore,
  appStore = defaultAppStore,
}) => {
  const contextValue = useCreateContextStore<MetadataContextState>({
    experienceStore,
    schemaStore,
    appStore,
  });

  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
};
