import { DrawerProps } from '@fluentui/react-components';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { AppHeaderContainer } from './AppHeaderContianer';
import { NavigationContainer } from './NavigationContainer';

type DrawerType = Required<DrawerProps>['type'];

export const AppUI: FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();

  const [isNavOpen, setIsNavOpen] = useState(!isMobile);
  const navType = useMemo<DrawerType>(
    () => (isMobile ? 'overlay' : 'inline'),
    [isMobile]
  );

  useEffect(() => {
    setIsNavOpen(!isMobile);
  }, [isMobile]);

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeaderContainer onNavToggle={() => setIsNavOpen(!isNavOpen)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <NavigationContainer
          open={isNavOpen}
          type={navType}
          onOpenChange={(open) => setIsNavOpen(open)}
        />
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
