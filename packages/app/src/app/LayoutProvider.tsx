import { IDataService, IFileService } from '@headless-adminapp/core/transport';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

import {
  AuthProvider,
  AuthProviderPlaceholderProps,
  AuthProviderProps,
} from '../auth';
import { queryClient as defaultQueryClient } from '../defaults';
import { DialogProvider } from '../dialog';
import { HeaderProvider } from '../header';
import { LocaleProvider, LocaleProviderProps } from '../locale';
import { MetadataProvider } from '../metadata';
import { MetadataProviderProps } from '../metadata/MetadataProvider';
import { UnsavedChangesRouteGuard } from '../navigation/unsaved-changes';
import { ProgressIndicatorProvider } from '../progress-indicator';
import { RouteProvider } from '../route';
import { RouteProviderProps } from '../route/RouteProvider';
import { ToastNotificationProvider } from '../toast-notification';
import { DataServiceContext } from '../transport';
import { FileServiceContext } from '../transport/context';
import { AuthWrapper } from './AuthWrapper';

export interface LayoutProviderProps {
  routeProps: RouteProviderProps;
  queryClient?: QueryClient;
  localeProps?: LocaleProviderProps;
  dataService?: IDataService;
  fileService?: IFileService;
  authProps?: AuthProviderProps;
  authPlaceholder?: FC<AuthProviderPlaceholderProps>;
  metadataProps?: MetadataProviderProps;
  containers: {
    DialogContainer: FC;
    ProgressIndicatorContainer: FC;
    ToastNotificationContainer: FC;
  };
}

const dataServiceNotProvidedError = new Error('No data service provided');

const defaultDataService: IDataService = {
  createRecord: async () => {
    throw dataServiceNotProvidedError;
  },
  deleteRecord: async () => {
    throw dataServiceNotProvidedError;
  },
  customAction: async () => {
    throw dataServiceNotProvidedError;
  },
  retriveAggregate: async () => {
    throw dataServiceNotProvidedError;
  },
  retriveRecord: async () => {
    throw dataServiceNotProvidedError;
  },
  retriveRecords: async () => {
    throw dataServiceNotProvidedError;
  },
  updateRecord: async () => {
    throw dataServiceNotProvidedError;
  },
};

export const LayoutProvider: FC<PropsWithChildren<LayoutProviderProps>> = ({
  authPlaceholder,
  authProps,
  dataService = defaultDataService,
  fileService,
  localeProps,
  metadataProps,
  queryClient = defaultQueryClient,
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
        <LocaleProvider {...localeProps}>
          <MetadataProvider {...metadataProps}>
            <DataServiceContext.Provider value={dataService}>
              <FileServiceContext.Provider value={fileService ?? null}>
                <DialogProvider>
                  <ProgressIndicatorProvider>
                    <ToastNotificationProvider>
                      <DialogContainer />
                      <ProgressIndicatorContainer />
                      <ToastNotificationContainer />
                      <AuthProvider {...authProps}>
                        <HeaderProvider>
                          <AuthWrapper Placeholder={authPlaceholder}>
                            <UnsavedChangesRouteGuard />
                            {children}
                          </AuthWrapper>
                        </HeaderProvider>
                      </AuthProvider>
                    </ToastNotificationProvider>
                  </ProgressIndicatorProvider>
                </DialogProvider>
              </FileServiceContext.Provider>
            </DataServiceContext.Provider>
          </MetadataProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </RouteProvider>
  );
};
