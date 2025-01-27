import { useCallback } from 'react';

import { useContextSetValue } from '../../mutable/context';
import { ToastNotificationContext, ToastNotificationItem } from '../context';

function markToastNotificationAsClosed(
  items: ToastNotificationItem[],
  id: string
) {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, isOpen: false };
    }

    return item;
  });
}

function excludeToastNotificationItemById(
  items: ToastNotificationItem[],
  id: string
) {
  return items.filter((item) => item.id !== id);
}

export function useCloseToastNotification() {
  const setValue = useContextSetValue(ToastNotificationContext);

  const closeDialog = useCallback(
    (id: string) => {
      setValue((state) => ({
        items: markToastNotificationAsClosed(state.items, id),
      }));

      // Simulate a delay to show the dialog closing animation
      setTimeout(() => {
        setValue((state) => ({
          items: excludeToastNotificationItemById(state.items, id),
        }));
      }, 1000);
    },
    [setValue]
  );

  return closeDialog;
}
