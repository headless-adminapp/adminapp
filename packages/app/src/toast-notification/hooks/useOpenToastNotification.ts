import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

import { useContextSetValue } from '../../mutable/context';
import { ToastNotificationContext, ToastNotificationItem } from '../context';
import { useCloseToastNotification } from './useCloseToastNotification';

export function useOpenToastNotification() {
  const setValue = useContextSetValue(ToastNotificationContext);
  const closeDialog = useCloseToastNotification();

  const openToastNotification = useCallback(
    (options: Omit<ToastNotificationItem, 'id' | 'isOpen'>) => {
      const id = uuid();

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
