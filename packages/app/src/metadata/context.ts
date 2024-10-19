import {
  IClientAppStore,
  ISchemaExperienceStore,
  ISchemaStore,
} from '@headless-adminapp/core/store';

import { createContext } from '../mutable/context';

export interface MetadataContextState {
  appStore: IClientAppStore;
  schemaStore: ISchemaStore;
  experienceStore: ISchemaExperienceStore;
}

export const MetadataContext = createContext<MetadataContextState>();
