import { useCallback } from 'react';

import { useContextSetValue } from '../../mutable/context';
import { ToastNotificationContext, ToastNotificationItem } from '../context';
import { useCloseToastNotification } from './useCloseToastNotification';

function randomId() {
  return Math.random().toString(36).substring(2);
}

export function useOpenToastNotification() {
  const setValue = useContextSetValue(ToastNotificationContext);
  const closeDialog = useCloseToastNotification();

  const openToastNotification = useCallback(
    (options: Omit<ToastNotificationItem, 'id' | 'isOpen'>) => {
      const id = randomId();

      setValue((state) => {
        return {
          items: [
            ...state.items,
            {
              id,
              isOpen: true,
              ...options,
            },
          ],
        };
      });

      return { id, close: () => closeDialog(id) };
    },
    [setValue, closeDialog]
  );

  return openToastNotification;
}
