import { useContext } from 'react';

import { FileServiceContext } from '../context';

export function useFileService() {
  const context = useContext(FileServiceContext);
  if (!context) {
    throw new Error(
      'FileServiceContext must be used within a FileServiceProvider'
    );
  }
  return context;
}
