import { AppProvider } from '@headless-adminapp/app/app';
import { FC, PropsWithChildren } from 'react';

import { AppUI } from './AppUI';

interface AppProps {}

export const App: FC<PropsWithChildren<AppProps>> = ({ children }) => {
  return (
    <AppProvider>
      <AppUI>{children}</AppUI>
    </AppProvider>
  );
};
