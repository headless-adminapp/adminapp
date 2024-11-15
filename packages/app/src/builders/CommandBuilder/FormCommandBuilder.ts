import {
  EntityFormCommandContext,
  EntityMainFormCommandItemExperience,
} from '@headless-adminapp/core/experience/form';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

namespace EnabledRules {
  export function HasCreatePermisssion(context: EntityFormCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableCreate;
  }

  export function HasUpdatePermission(context: EntityFormCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableUpdate;
  }

  export function HasDeletePermission(context: EntityFormCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableDelete;
  }
}

export namespace FormCommandBuilder {
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
      hidden: [
        (context) => {
          if (context.primaryControl.readonly) {
            return true;
          }

          if (context.primaryControl.recordId) {
            return !EnabledRules.HasUpdatePermission(context);
          } else {
            return !EnabledRules.HasCreatePermisssion(context);
          }
        },
      ],
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
      hidden: [
        (context) => {
          if (context.primaryControl.readonly) {
            return true;
          }

          if (context.primaryControl.recordId) {
            return !EnabledRules.HasUpdatePermission(context);
          } else {
            return !EnabledRules.HasCreatePermisssion(context);
          }
        },
      ],
    };
  }

  export interface DeleteRecordCommandStringSet {
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
    localizedStringSet?: Localized<
      | DeleteRecordCommandStringSet
      | ((context: EntityFormCommandContext) => DeleteRecordCommandStringSet)
    >;
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

        return !EnabledRules.HasDeletePermission(context);
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

          await context.dataService.deleteRecord(
            context.primaryControl.logicalName,
            recordId
          );

          context.utility.showNotification({
            title: stringSet.successNotification.title,
            text: stringSet.successNotification.text,
            type: 'success',
          });

          context.primaryControl.close();
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
