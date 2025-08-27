import { FC, PropsWithChildren } from 'react';

import { AppUI } from './AppUI';

interface AppProps {}

export const App: FC<PropsWithChildren<AppProps>> = ({ children }) => {
  return <AppUI>{children}</AppUI>;
};
