import type { AppExperience } from '@headless-adminapp/core/experience/app';
import type { SchemaExperienceMetadata } from '@headless-adminapp/core/experience/schema';
import { createContext } from 'react';

export interface AppContextState {
  appExperience: AppExperience;
  schemaMetadataList: SchemaExperienceMetadata[];
  schemaMetadataDic: Record<string, SchemaExperienceMetadata>;
}

export const AppContext = createContext<AppContextState | null>(null);
