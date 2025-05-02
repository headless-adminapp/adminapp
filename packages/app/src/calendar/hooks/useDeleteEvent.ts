import { useOpenConfirmDialog } from '@headless-adminapp/app/dialog';
import { useProgressIndicator } from '@headless-adminapp/app/progress-indicator';
import { useOpenToastNotification } from '@headless-adminapp/app/toast-notification';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useConfig } from './useConfig';

export function useDeleteEvent() {
  const openConfirmDialog = useOpenConfirmDialog();
  const openToastNotification = useOpenToastNotification();
  const { hideProgressIndicator, showProgressIndicator } =
    useProgressIndicator();

  const config = useConfig();

  const queryClient = useQueryClient();

  const deleteEvent = useCallback(
    async (id: string) => {
      try {
        if (!config.deleteEvent) {
          throw new Error('Delete event function is not defined.');
        }

        const confirmResult = await openConfirmDialog({
          title: 'Delete Event',
          text: 'Are you sure you want to delete this event?',
        });

        if (!confirmResult?.confirmed) {
          return;
        }

        showProgressIndicator('Deleting event...');

        await config.deleteEvent(id);

        await queryClient.invalidateQueries({
          queryKey: ['calendar-events'],
        });

        close();
      } catch (error) {
        openToastNotification({
          title: 'Error',
          text: (error as Error).message,
          type: 'error',
        });
      } finally {
        hideProgressIndicator();
      }
    },
    [
      config,
      hideProgressIndicator,
      openConfirmDialog,
      openToastNotification,
      queryClient,
      showProgressIndicator,
    ]
  );

  return deleteEvent;
}
