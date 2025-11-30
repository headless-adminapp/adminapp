import { DrawerProps, tokens } from '@fluentui/react-components';
import { useIsMobile, useIsTablet } from '@headless-adminapp/app/hooks';
import { FC, PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { AppHeaderContainer } from './AppHeaderContianer';
import { NavigationContainer } from './Navigation';

type DrawerType = Required<DrawerProps>['type'];

interface AppUIProps {
  appFooter?: React.ReactNode;
}

export const AppUI: FC<PropsWithChildren<AppUIProps>> = ({
  children,
  appFooter,
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [isNavOpen, setIsNavOpen] = useState(!isMobile);
  const navType = useMemo<DrawerType>(
    () => (isMobile ? 'overlay' : 'inline'),
    [isMobile]
  );

  useEffect(() => {
    setIsNavOpen(!isTablet);
  }, [isMobile, isTablet]);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        inset: 0,
      }}
    >
      <AppHeaderContainer onNavToggle={() => setIsNavOpen(!isNavOpen)} />
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          background: tokens.colorNeutralBackground1,
        }}
      >
        <NavigationContainer
          open={isNavOpen}
          type={navType}
          isMini={!isMobile && isTablet && !isNavOpen}
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
      {appFooter}
    </main>
  );
};
