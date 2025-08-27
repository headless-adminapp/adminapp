import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import { QuickCreateContext, QuickCreateContextState } from './context';

interface QuickCreateProviderProps {}

export const QuickCreateProvider: FC<
  PropsWithChildren<QuickCreateProviderProps>
> = ({ children }) => {
  const contextState = useCreateContextStore<QuickCreateContextState>({
    items: [],
  });

  return (
    <QuickCreateContext.Provider value={contextState}>
      {children}
    </QuickCreateContext.Provider>
  );
};
