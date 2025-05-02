import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { useQueryClient } from '@tanstack/react-query';

import { useOpenDialog } from '../../dialog/hooks/useOpenDialog';
import { useOpenToastNotification } from '../../toast-notification/hooks/useOpenToastNotification';
import { CalendarEventSaveData, CalendarEventSaveFnOptions } from '../types';
import { useConfig } from './useConfig';

export function useOpenDetailDialog<
  SA1 extends SchemaAttributes = SchemaAttributes,
  SA2 extends SchemaAttributes = SchemaAttributes
>(DialogComponent: React.ComponentType<any>) {
  const openDialog = useOpenDialog();
  const openToastNotification = useOpenToastNotification();
  const config = useConfig();
  const queryClient = useQueryClient();

  function openEventDetailModel(values: unknown) {
    const { close } = openDialog({
      type: 'custom',
      Component: DialogComponent,
      props: {
        onDismiss: () => {
          close();
        },
        config,
        values,
        onSubmit: async (data: {
          modifiedValues: Partial<CalendarEventSaveData<SA1, SA2>>;
          values: CalendarEventSaveData<SA1, SA2>;
        }) => {
          if (!config.saveEvent) {
            return;
          }

          try {
            const { id, end, start, title, allDay, description, ...rest } =
              data.values;
            await config.saveEvent({
              event: {
                id,
                title,
                start: start ? new Date(start) : null,
                end: end ? new Date(end) : null,
                allDay: allDay ?? false,
                description,
                ...rest,
              } as CalendarEventSaveFnOptions<SA1, SA2>['event'],
              modifiedValues: data.modifiedValues,
            });

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
          }
        },
        onCancel: () => {
          close();
        },
      },
    });
  }

  return openEventDetailModel;
}
