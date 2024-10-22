import { FC, PropsWithChildren } from 'react';

import { AppHeaderContainer } from './AppHeaderContianer';
import { NavigationContainer } from './NavigationContainer';

export const AppUI: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeaderContainer />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NavigationContainer />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </main>
  );
};
