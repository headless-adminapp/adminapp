import type { AppExperience } from '@headless-adminapp/core/experience/app';
import type {
  ISchemaExperienceStore,
  ISchemaStore,
} from '@headless-adminapp/core/store';

import { createContext } from '../mutable/context';
import { IRecentItemStore } from '../store';

export interface MetadataContextState {
  schemaStore: ISchemaStore;
  experienceStore: ISchemaExperienceStore;
  appExperience: AppExperience;
  recentItemStore: IRecentItemStore;
}

export const MetadataContext = createContext<MetadataContextState>();
