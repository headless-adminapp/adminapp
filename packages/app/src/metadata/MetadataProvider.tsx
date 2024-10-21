import {
  IClientAppStore,
  ISchemaExperienceStore,
  ISchemaStore,
} from '@headless-adminapp/core/store';
import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import { MetadataContext, MetadataContextState } from './context';

export interface MetadataProviderProps {
  schemaStore: ISchemaStore;
  experienceStore: ISchemaExperienceStore;
  appStore: IClientAppStore;
}

export const MetadataProvider: FC<PropsWithChildren<MetadataProviderProps>> = ({
  children,
  experienceStore,
  schemaStore,
  appStore,
}) => {
  const contextValue = useCreateContextStore<MetadataContextState>({
    // schemas: {},
    // schemaLoading: true,
    experienceStore,
    schemaStore,
    appStore,
  });

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const schemas = schemaStore.getSchemas();
  //   contextValue.setValue({
  //     schemas,
  //     schemaLoading: false,
  //   });
  //   setLoading(false);
  // }, [contextValue, schemaStore]);

  // if (loading) {
  //   return null;
  // }

  return (
    <MetadataContext.Provider value={contextValue}>
      {children}
    </MetadataContext.Provider>
  );
};
