import type { AppExperience } from '@headless-adminapp/core/experience/app';
import type {
  ISchemaExperienceStore,
  ISchemaStore,
} from '@headless-adminapp/core/store';
import { ICalculatedAttributeStore } from '@headless-adminapp/core/store/ICalculatedAttributeStore';

import { createContext } from '../mutable/context';
import { IRecentItemStore } from '../store';

export interface MetadataContextState {
  schemaStore: ISchemaStore;
  experienceStore: ISchemaExperienceStore;
  appExperience: AppExperience;
  recentItemStore: IRecentItemStore;
  calculatedAttributeStore?: ICalculatedAttributeStore;
}

export const MetadataContext = createContext<MetadataContextState>();
