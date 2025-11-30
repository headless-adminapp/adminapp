import { FC, PropsWithChildren } from 'react';

import { AppUI } from './AppUI';

interface AppProps {
  appFooter?: React.ReactNode;
}

export const App: FC<PropsWithChildren<AppProps>> = (props) => {
  return <AppUI {...props} />;
};
