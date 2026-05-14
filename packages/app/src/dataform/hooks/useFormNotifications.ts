import { useMemo } from 'react';

import { useFormInstance } from './useFormInstance';
import { useFormIsReadonly } from './useFormIsReadonly';

type Notification = {
  level: 'info' | 'warning' | 'error';
  message: string;
};

export function useFormNotifications() {
  const readonly = useFormIsReadonly();

  const formInstance = useFormInstance();

  const formInstanceAvailable = !!formInstance;
  const errors = formInstance?.formState.errors;
  const isSubmitted = formInstance?.formState.isSubmitted;

  return useMemo(() => {
    const notifications: Notification[] = [];

    if (readonly) {
      notifications.push({
        level: 'warning',
        message: 'This record is read only',
      });
    }

    if (
      formInstanceAvailable &&
      isSubmitted &&
      Object.keys(errors).length > 0
    ) {
      notifications.push({
        level: 'error',
        message: 'Please fill in the required fields',
      });
    }

    return notifications;
  }, [formInstanceAvailable, errors, isSubmitted, readonly]);
}
