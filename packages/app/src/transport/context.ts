import { IDataService, IFileService } from '@headless-adminapp/core/transport';
import { createContext } from 'react';

export const DataServiceContext = createContext<IDataService | undefined>(
  undefined
);

export const noopFileService = {
  uploadFile: async () => {
    throw new Error('File service not implemented');
  },
} as IFileService;

export const FileServiceContext = createContext<IFileService>(noopFileService);
