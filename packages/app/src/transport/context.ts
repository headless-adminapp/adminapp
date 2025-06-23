import { IDataService, IFileService } from '@headless-adminapp/core/transport';
import { createContext } from 'react';

export const DataServiceContext = createContext<IDataService | undefined>(
  undefined
);

export const FileServiceContext = createContext<IFileService | null>(null);
