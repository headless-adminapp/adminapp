import { useContext } from 'react';

import { FileServiceContext } from '../context';

export function useFileService() {
  const context = useContext(FileServiceContext);
  return context;
}
