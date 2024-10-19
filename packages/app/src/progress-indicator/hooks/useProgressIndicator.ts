import { useContext } from 'react';

import { ProgressIndicatorContext } from '../context';

export function useProgressIndicator() {
  const context = useContext(ProgressIndicatorContext);

  if (!context) {
    throw new Error(
      'useProgressIndicator must be used within a ProgressIndicatorProvider'
    );
  }

  return context;
}
