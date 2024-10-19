import { AppExperience } from '@headless-adminapp/core/experience/app';
import { SchemaExperienceMetadata } from '@headless-adminapp/core/experience/schema';
import { createContext } from 'react';

export interface AppContextState {
  app: AppExperience;
  schemaMetadataList: SchemaExperienceMetadata[];
  schemaMetadataDic: Record<string, SchemaExperienceMetadata>;
}

export const AppContext = createContext<AppContextState | null>(null);
