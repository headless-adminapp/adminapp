import { useContext } from 'react';

import { AppContext, AppContextState } from '../context';

export function useAppContext(): AppContextState {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  return context;
}
