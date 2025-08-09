import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import {
  defaultHeaderStoreState,
  HeaderContext,
  type HeaderStoreState,
} from './context';

export const HeaderProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const contextValue = useCreateContextStore<HeaderStoreState>(
    defaultHeaderStoreState
  );

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
};
