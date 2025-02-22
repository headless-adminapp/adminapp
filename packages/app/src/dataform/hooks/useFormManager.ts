import { useContext, useMemo } from 'react';

import { DataFormContext } from '../context';
import { FormManager } from '../FormManager';

export function useFormManager() {
  const context = useContext(DataFormContext);

  if (!context) {
    throw new Error('useFormManager must be used within a DataFormProvider');
  }

  return useMemo(() => new FormManager(context), [context]);
}
