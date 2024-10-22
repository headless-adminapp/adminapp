import { IDataService } from '@headless-adminapp/core/transport';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';

import { AppearanceContext, AppearanceContextState } from '../appearance';
import {
  AuthProvider,
  AuthProviderPlaceholderProps,
  AuthProviderProps,
} from '../auth';
import { DialogProvider } from '../dialog';
import { LocaleProvider, LocaleProviderProps } from '../locale';
import { MetadataProvider } from '../metadata';
import { MetadataProviderProps } from '../metadata/MetadataProvider';
import { ProgressIndicatorProvider } from '../progress-indicator';
import { RecordSetProvider } from '../recordset';
import { RouteProvider } from '../route';
import { RouteProviderProps } from '../route/RouteProvider';
import { ToastNotificationProvider } from '../toast-notification';
import { DataServiceContext } from '../transport';
import { AuthWrapper } from './AuthWrapper';

export interface LayoutProviderProps {
  routeProps: RouteProviderProps;
  queryClient: QueryClient;
  appearanceState: [
    AppearanceContextState,
    Dispatch<SetStateAction<AppearanceContextState>>
  ];
  localeProps: LocaleProviderProps;
  dataService: IDataService;
  authProps: AuthProviderProps;
  authPlaceholder: FC<AuthProviderPlaceholderProps>;
  metadataProps: MetadataProviderProps;
  containers: {
    DialogContainer: FC;
    ProgressIndicatorContainer: FC;
    ToastNotificationContainer: FC;
  };
}

/** @todo: move to app */
export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({
  appearanceState,
  authPlaceholder,
  authProps,
  dataService,
  localeProps,
  metadataProps,
  queryClient,
  routeProps,
  children,
  containers: {
    DialogContainer,
    ProgressIndicatorContainer,
    ToastNotificationContainer,
  },
}) => {
  return (
    <RouteProvider {...routeProps}>
      <QueryClientProvider client={queryClient}>
        <AppearanceContext.Provider value={appearanceState}>
          <LocaleProvider {...localeProps}>
            <MetadataProvider {...metadataProps}>
              <DataServiceContext.Provider value={dataService}>
                <DialogProvider>
                  <ProgressIndicatorProvider>
                    <ToastNotificationProvider>
                      <DialogContainer />
                      <ProgressIndicatorContainer />
                      <ToastNotificationContainer />
                      <AuthProvider {...authProps}>
                        <AuthWrapper Placeholder={authPlaceholder}>
                          <RecordSetProvider>{children}</RecordSetProvider>
                        </AuthWrapper>
                      </AuthProvider>
                    </ToastNotificationProvider>
                  </ProgressIndicatorProvider>
                </DialogProvider>
              </DataServiceContext.Provider>
            </MetadataProvider>
          </LocaleProvider>
        </AppearanceContext.Provider>
      </QueryClientProvider>
    </RouteProvider>
  );
};
