import {
  EntityFormCommandContext,
  EntityMainFormCommandItemExperience,
} from '@headless-adminapp/core/experience/form';
import {
  EntityMainGridCommandItemExperience,
  SubGridCommandItemExperience,
} from '@headless-adminapp/core/experience/view';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

export function localizedLabel<
  T extends { label: string; localizedLabels?: Localized<string> }
>(language: string, value: T, fallback?: T): string {
  return (
    value.localizedLabels?.[language] ??
    fallback?.localizedLabels?.[language] ??
    value.label ??
    fallback?.label
  );
}

export function createLocalizedSelector<T>(
  stringSet: T,
  localizedStringSet: Localized<T> | undefined,
  language: string
) {
  return function selectLocalized<U>(selector: (stringSet: T) => U): U {
    if (localizedStringSet && localizedStringSet[language]) {
      return selector(localizedStringSet[language]);
    }

    return selector(stringSet);
  };
}

export namespace CommandBuilder {
  export namespace View {
    export function createNewRecordCommand({
      Icon,
      text,
      localizedTexts,
    }: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    }): EntityMainGridCommandItemExperience {
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
    }): EntityMainGridCommandItemExperience {
      return {
        type: 'button',
        Icon,
        text,
        localizedText: localizedTexts,
        isContextMenu: true,
        onClick: (context) => {
          console.log('Edit record', context);
        },
        hidden: (context) => context.primaryControl.selectedIds.length !== 1, // TODO: check permissions
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
    }): EntityMainGridCommandItemExperience {
      return {
        type: 'button',
        Icon,
        text,
        localizedText,
        danger: true,
        isContextMenu: true,
        hidden: [(context) => context.primaryControl.selectedIds.length === 0], // TODO: check permissions
        onClick: async (context) => {
          const recordIds = context.primaryControl.selectedIds;

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

            context.primaryControl.refresh();
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
    }): EntityMainGridCommandItemExperience {
      return {
        type: 'button',
        Icon,
        text,
        localizedText: localizedTexts,
        onClick: (context) => {
          context.primaryControl.refresh();
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
    }): EntityMainGridCommandItemExperience {
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

  export namespace Form {
    export function createSaveCommand({
      Icon,
      text,
      localizedTexts,
    }: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    }): EntityMainFormCommandItemExperience {
      return {
        type: 'button',
        Icon,
        text,
        localizedText: localizedTexts,
        isQuickAction: true,
        onClick: async (context) => {
          await context.primaryControl.save('save');
        },
        hidden: (context) => {
          if (context.primaryControl.readonly) {
            return true;
          }

          return false;
        },
      };
    }

    export function createSaveAndCloseCommand({
      Icon,
      text,
      localizedTexts,
    }: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    }): EntityMainFormCommandItemExperience {
      return {
        type: 'button',
        Icon,
        text,
        localizedText: localizedTexts,
        onClick: async (context) => {
          await context.primaryControl.save('saveandclose');
        },
        hidden: (context) => {
          if (context.primaryControl.readonly) {
            return true;
          }

          return false;
        },
      };
    }

    interface DeleteRecordCommandStringSet {
      confirmation: {
        title: string;
        text: string;
        buttonCancel: string;
        buttonConfirm: string;
      };
      status: {
        deleting: string;
      };
      successNotification: {
        title: string;
        text: string;
      };
      errorNotification: {
        title: string;
      };
    }

    export const defaultDeleteRecordStringSet: DeleteRecordCommandStringSet = {
      confirmation: {
        text: 'Are you sure you want to delete this record?',
        title: 'Delete record',
        buttonConfirm: 'Delete',
        buttonCancel: 'Cancel',
      },
      status: {
        deleting: 'Deleting record',
      },
      successNotification: {
        title: 'Record deleted',
        text: 'Record deleted successfully',
      },
      errorNotification: {
        title: 'Error',
      },
    };

    export function createDeleteCommand({
      Icon,
      text,
      localizedTexts,
      stringSet,
    }: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
      stringSet:
        | DeleteRecordCommandStringSet
        | ((context: EntityFormCommandContext) => DeleteRecordCommandStringSet);
    }): EntityMainFormCommandItemExperience {
      return {
        Icon: Icon,
        type: 'button',
        text,
        localizedText: localizedTexts,
        danger: true,
        hidden: (context) => {
          if (!context.primaryControl.recordId) {
            return true;
          }

          if (context.primaryControl.schema.restrictions?.disableDelete) {
            return true;
          }

          return false;
        },
        onClick: async (context) => {
          const recordId = context.primaryControl.recordId;

          if (!recordId) {
            return;
          }

          if (typeof stringSet === 'function') {
            stringSet = stringSet(context);
          }

          try {
            const confirmResult = await context.utility.openConfirmDialog({
              title: stringSet.confirmation.title,
              text: stringSet.confirmation.text,
              cancelButtonLabel: stringSet.confirmation.buttonCancel,
              confirmButtonLabel: stringSet.confirmation.buttonConfirm,
            });

            if (!confirmResult?.confirmed) {
              return;
            }

            context.utility.showProgressIndicator(
              stringSet.status.deleting + '...'
            );

            await new Promise((resolve) => setTimeout(resolve, 2000));
            // await context.dataService.deleteRecord(
            //   context.primaryControl.logicalName,
            //   recordId
            // );

            context.utility.showNotification({
              title: stringSet.successNotification.title,
              text: stringSet.successNotification.text,
              type: 'success',
            });

            // context.primaryControl.close();
          } catch (error) {
            context.utility.showNotification({
              title: stringSet.errorNotification.title,
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
      text,
      localizedTexts,
    }: {
      Icon: Icon;
      text: string;
      localizedTexts?: Record<string, string>;
    }): EntityMainFormCommandItemExperience {
      return {
        Icon,
        type: 'button',
        text,
        localizedText: localizedTexts,
        onClick: async (context) => {
          await context.primaryControl.refresh();
        },
        hidden: (context) => !context.primaryControl.recordId,
      };
    }
  }

  export namespace Subgrid {
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
        hidden: [
          (context) => context.secondaryControl.selectedIds.length === 0,
        ], // TODO: check permissions
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
}
