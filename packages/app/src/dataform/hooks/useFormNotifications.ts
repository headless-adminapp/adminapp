import { useMemo } from 'react';

import { useFormInstance } from './useFormInstance';
import { useFormIsReadonly } from './useFormIsReadonly';

export function useFormNotifications() {
  const readonly = useFormIsReadonly();

  const formInstance = useFormInstance();

  const formInstanceAvailable = !!formInstance;

  return useMemo(() => {
    type Notification = {
      level: 'info' | 'warning' | 'error';
      message: string;
    };

    const notifications: Notification[] = [];

    if (readonly) {
      notifications.push({
        level: 'warning',
        message: 'This record is read only',
      });
    }

    if (
      formInstanceAvailable &&
      formInstance.formState.isSubmitted &&
      Object.keys(formInstance.formState.errors).length > 0
    ) {
      notifications.push({
        level: 'error',
        message: 'Please fill in the required fields',
      });
    }

    return notifications;
  }, [
    formInstanceAvailable,
    formInstance?.formState.errors,
    formInstance?.formState.isSubmitted,
    readonly,
  ]);
}
