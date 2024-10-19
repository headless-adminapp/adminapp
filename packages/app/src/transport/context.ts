import { IDataService } from '@headless-adminapp/core/transport';
import { createContext } from 'react';

export const DataServiceContext = createContext<IDataService | undefined>(
  undefined
);
