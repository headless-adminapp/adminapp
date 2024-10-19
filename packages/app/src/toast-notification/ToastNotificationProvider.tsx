import { FC, PropsWithChildren } from 'react';

import { useCreateContextStore } from '../mutable/context';
import {
  ToastNotificationContext,
  ToastNotificationContextState,
} from './context';

interface ToastNotificationProviderProps {}

export const ToastNotificationProvider: FC<
  PropsWithChildren<ToastNotificationProviderProps>
> = ({ children }) => {
  const contextState = useCreateContextStore<ToastNotificationContextState>({
    items: [],
  });

  return (
    <ToastNotificationContext.Provider value={contextState}>
      {children}
    </ToastNotificationContext.Provider>
  );
};
