import { SubGridCommandItemExperience } from '@headless-adminapp/core/experience/view';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

import { createLocalizedSelector } from './utils';

export namespace SubgridCommandBuilder {
  export function createNewRecordCommand({
    Icon,
    text,
    localizedTexts,
  }: {
    Icon: Icon;
    text: string;
    localizedTexts?: Record<string, string>;
  }): SubGridCommandItemExperience {
    return {
      type: 'button',
      Icon,
      text,
      localizedText: localizedTexts,
      onClick: (context) => {
        console.log('New record', context);
      },
      hidden: (context) => {
        console.log(context);
        // TODO: Implement logic to hide the button
        return false;
      },
    };
  }

  export function createEditRecordCommand({
    Icon,
    text,
    localizedTexts,
  }: {
    Icon: Icon;
    text: string;
    localizedTexts?: Record<string, string>;
  }): SubGridCommandItemExperience {
    return {
      type: 'button',
      Icon,
      text,
      localizedText: localizedTexts,
      isContextMenu: true,
      onClick: (context) => {
        console.log('Edit record', context);
      },
      // hidden: (context) => context.secondaryControl.selectedIds.length !== 1, // TODO: check permissions
      hidden: (context) => {
        console.log('temp.', context);

        return context.secondaryControl.selectedIds.length !== 1;
      },
    };
  }

  interface DeleteRecordCommandStringSet {
    confirmation: {
      title: string | string[];
      text: string | string[];
      buttonCancel: string;
      buttonConfirm: string;
    };
    status: {
      deleting: string | string[];
    };
    successNotification: {
      title: string | string[];
      text: string | string[];
    };
    errorNotification: {
      title: string;
    };
  }

  function plurialize(
    count: number,
    singular: string | string[],
    plural?: string
  ): string {
    if (Array.isArray(singular)) {
      plural = singular[1];
      singular = singular[0];
    }

    let msg = count === 1 ? singular : plural ?? singular;

    msg = msg.replace('{count}', count.toString());

    return msg;
  }

  export const defaultDeleteRecordStringSet: DeleteRecordCommandStringSet = {
    confirmation: {
      text: [
        'Are you sure you want to delete this record?',
        'Are you sure you want to delete selected records?',
      ],
      title: ['Delete record', 'Delete records'],
      buttonConfirm: 'Delete',
      buttonCancel: 'Cancel',
    },
    status: {
      deleting: ['Deleting record', 'Deleting records'],
    },
    successNotification: {
      title: ['Record deleted', 'Records deleted'],
      text: ['Record deleted successfully', 'Records deleted successfully'],
    },
    errorNotification: {
      title: 'Error',
    },
  };

  export function createDeleteRecordCommand({
    Icon,
    localizedText,
    text,
    stringSet = defaultDeleteRecordStringSet,
    localizedStringSet,
  }: {
    Icon: Icon;
    text: string;
    localizedText?: Record<string, string>;
    stringSet?: DeleteRecordCommandStringSet;
    localizedStringSet?: Localized<DeleteRecordCommandStringSet>;
  }): SubGridCommandItemExperience {
    return {
      type: 'button',
      Icon,
      text,
      localizedText,
      danger: true,
      isContextMenu: true,
      hidden: [(context) => context.secondaryControl.selectedIds.length === 0], // TODO: check permissions
      onClick: async (context) => {
        const recordIds = context.secondaryControl.selectedIds;

        if (!recordIds.length) {
          return;
        }

        const localizeSelector = createLocalizedSelector(
          stringSet,
          localizedStringSet,
          context.locale.language
        );

        try {
          const confirmResult = await context.utility.openConfirmDialog({
            title: plurialize(
              recordIds.length,
              localizeSelector((s) => s.confirmation.title)
            ),
            text: plurialize(
              recordIds.length,
              localizeSelector((s) => s.confirmation.text)
            ),
            cancelButtonLabel: localizeSelector(
              (s) => s.confirmation.buttonCancel
            ),
            confirmButtonLabel: localizeSelector(
              (s) => s.confirmation.buttonConfirm
            ),
          });

          if (!confirmResult?.confirmed) {
            return;
          }

          context.utility.showProgressIndicator(
            plurialize(
              recordIds.length,
              localizeSelector((s) => s.status.deleting)
            ) + '...'
          );

          await new Promise((resolve) => setTimeout(resolve, 2000));

          context.utility.showNotification({
            title: plurialize(
              recordIds.length,
              localizeSelector((s) => s.successNotification.title)
            ),
            text: plurialize(
              recordIds.length,
              localizeSelector((s) => s.successNotification.text)
            ),
            type: 'success',
          });

          await context.primaryControl.refresh();
        } catch (error) {
          context.utility.showNotification({
            title: localizeSelector((s) => s.errorNotification.title),
            text: (error as Error).message,
            type: 'error',
          });
        } finally {
          context.utility.hideProgressIndicator();
        }
      },
    };
  }

  export function createRefreshCommand({
    Icon,
    localizedTexts,
    text,
  }: {
    Icon: Icon;
    text: string;
    localizedTexts?: Record<string, string>;
  }): SubGridCommandItemExperience {
    return {
      type: 'button',
      Icon,
      text,
      localizedText: localizedTexts,
      onClick: (context) => {
        context.secondaryControl.refresh();
      },
    };
  }

  export function createExportCommand({
    button,
    csv,
    excel,
  }: {
    button: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    };
    excel: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    };
    csv: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    };
  }): SubGridCommandItemExperience {
    return {
      type: 'menu',
      Icon: button.Icon,
      text: button.text,
      localizedTexts: button.localizedTexts,
      items: [
        [
          {
            Icon: excel.Icon,
            text: excel.text,
            localizedTexts: excel.localizedTexts,
            onClick: (context) => {
              console.log('Export to Excel', context);
            },
          },
          {
            Icon: csv.Icon,
            text: csv.text,
            localizedTexts: csv.localizedTexts,
            onClick: (context) => {
              console.log('Export to CSV', context);
            },
          },
        ],
      ],
    };
  }
}
