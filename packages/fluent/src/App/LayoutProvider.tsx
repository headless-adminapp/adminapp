import { PartialTheme, webLightTheme } from '@fluentui/react-components';
import {
  LayoutProvider as LayoutProviderInternal,
  LayoutProviderProps as LayoutProviderIntenralProps,
} from '@headless-adminapp/app/app/LayoutProvider';
import { FC, PropsWithChildren } from 'react';

import { FluentProvider } from '../components/fluent';
import { ExtendedThemeProps } from '../components/fluent/FluentProvider';
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
