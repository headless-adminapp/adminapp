import type { PartialTheme } from '@fluentui/react-components';
import { webLightTheme } from '@fluentui/react-components';
import type { LayoutProviderProps as LayoutProviderIntenralProps } from '@headless-adminapp/app/app/LayoutProvider';
import { LayoutProvider as LayoutProviderInternal } from '@headless-adminapp/app/app/LayoutProvider';
import type { FC, PropsWithChildren } from 'react';

import { FluentProvider } from '../components/fluent';
import type { ExtendedThemeProps } from '../components/fluent/FluentProvider';
import { DialogContainer } from '../DialogContainer';
import { ProgressIndicatorContainer } from '../ProgressIndicatorContainer';
import { QuickCreateContainer } from '../QuickCreateContainer';
import { ToastNotificationContainer } from '../ToastNotificationContainer';

export type LayoutProviderProps = Omit<
  LayoutProviderIntenralProps,
  'containers'
> & {
  theme?: PartialTheme;
} & Partial<ExtendedThemeProps>;

export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({
  children,
  theme,
  corners,
  density,
  ...rest
}) => {
  return (
    <FluentProvider
      theme={theme ?? webLightTheme}
      corners={corners}
      density={density}
    >
      <LayoutProviderInternal
        {...rest}
        containers={{
          DialogContainer,
          ProgressIndicatorContainer,
          ToastNotificationContainer,
        }}
      >
        {children}
        <QuickCreateContainer />
      </LayoutProviderInternal>
    </FluentProvider>
  );
};
