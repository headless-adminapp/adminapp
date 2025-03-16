import {
  AppExperience,
  PageType,
} from '@headless-adminapp/core/experience/app';
import {
  ISchemaExperienceStore,
  ISchemaStore,
  SchemaStore,
} from '@headless-adminapp/core/store';
import { IconPlaceholder } from '@headless-adminapp/icons';
import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import { SchemaExperienceStore } from '../store';
import { MetadataContext, MetadataContextState } from './context';

export interface MetadataProviderProps {
  schemaStore?: ISchemaStore;
  experienceStore?: ISchemaExperienceStore;
  appExperience?: AppExperience;
}

export const defaultSchemaStore = new SchemaStore();
export const defaultExperienceStore = new SchemaExperienceStore({
  schemaStore: defaultSchemaStore,
});

const defaultApp: AppExperience = {
  id: 'default',
  title: 'Demo App',
  navItems: [],
  defaultPage: {
    label: 'Home',
    link: '/home',
    type: PageType.Custom,
    Icon: IconPlaceholder,
  },
  logo: {},
};

export const MetadataProvider: FC<PropsWithChildren<MetadataProviderProps>> = ({
  children,
  experienceStore = defaultExperienceStore,
  schemaStore = defaultSchemaStore,
  appExperience = defaultApp,
}) => {
  const contextValue = useCreateContextStore<MetadataContextState>({
    experienceStore,
    schemaStore,
    appExperience,
  });

  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
};
