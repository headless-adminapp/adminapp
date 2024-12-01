import {
  FluentProvider,
  PartialTheme,
  webLightTheme,
} from '@fluentui/react-components';
import {
  LayoutProvider as LayoutProviderInternal,
  LayoutProviderProps as LayoutProviderIntenralProps,
} from '@headless-adminapp/app/app/LayoutProvider';
import { FC, PropsWithChildren } from 'react';

import { DialogContainer } from '../DialogContainer';
import { ProgressIndicatorContainer } from '../ProgressIndicatorContainer';
import { ToastNotificationContainer } from '../ToastNotificationContainer';

export type LayoutProviderProps = Omit<
  LayoutProviderIntenralProps,
  'containers'
> & {
  theme?: PartialTheme;
};

export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({
  children,
  theme,
  ...rest
}) => {
  return (
    <FluentProvider theme={theme ?? webLightTheme}>
      <LayoutProviderInternal
        {...rest}
        containers={{
          DialogContainer,
          ProgressIndicatorContainer,
          ToastNotificationContainer,
        }}
      >
        {children}
      </LayoutProviderInternal>
    </FluentProvider>
  );
};
