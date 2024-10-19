import { useCallback } from 'react';

import { useContextSetValue } from '../../mutable/context';
import { ToastNotificationContext } from '../context';

export function useCloseToastNotification() {
  const setValue = useContextSetValue(ToastNotificationContext);

  const closeDialog = useCallback(
    (id: string) => {
      setValue((state) => {
        return {
          items: state.items.map((item) => {
            if (item.id === id) {
              return { ...item, isOpen: false };
            }

            return item;
          }),
        };
      });

      // Simulate a delay to show the dialog closing animation
      setTimeout(() => {
        setValue((state) => {
          return {
            items: state.items.filter((item) => item.id !== id),
          };
        });
      }, 1000);
    },
    [setValue]
  );

  return closeDialog;
}
