import { IDataService } from '@headless-adminapp/core/transport';
import { useContext } from 'react';

import { DataServiceContext } from '../context';

export function useDataService<T extends IDataService = IDataService>() {
  const context = useContext(DataServiceContext);
  if (!context) {
    throw new Error(
      'DataServiceContext must be used within a DataServiceProvider'
    );
  }
  return context as T;
}
