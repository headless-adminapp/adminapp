import { AppProvider } from '@headless-adminapp/app/app';
import { FC, PropsWithChildren } from 'react';

import { BodyLoading } from '../components/BodyLoading';
import { PageBroken } from '../components/PageBroken';
import { AppUI } from './AppUI';

interface AppProps {
  appId: string;
}

export const App: FC<PropsWithChildren<AppProps>> = ({ appId, children }) => {
  return (
    <AppProvider
      appId={appId}
      loadingComponent={<BodyLoading loading />}
      notFoundComponent={<PageBroken title="App not found" />}
    >
      <AppUI>{children}</AppUI>
    </AppProvider>
  );
};
