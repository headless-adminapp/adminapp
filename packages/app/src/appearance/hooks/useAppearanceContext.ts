import { useContext } from 'react';

import { AppearanceContext } from '../context';

export function useAppearanceContext() {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }

  return context;
}
