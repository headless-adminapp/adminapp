import { useContext } from 'react';

import { DataServiceContext } from '../context';

export function useDataService() {
  const context = useContext(DataServiceContext);
  if (!context) {
    throw new Error(
      'DataServiceContext must be used within a DataServiceProvider'
    );
  }
  return context;
}
