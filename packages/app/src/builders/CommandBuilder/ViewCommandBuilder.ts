import {
  EntityMainGridCommandContext,
  EntityMainGridCommandItemExperience,
} from '@headless-adminapp/core/experience/view';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

import { exportRecordsCSV, exportRecordsXLS, retriveRecords } from '../utils';
import { createLocalizedSelector, plurialize } from './utils';

namespace EnabledRules {
  export function HasCreatePermisssion(context: EntityMainGridCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableCreate;
  }

  export function HasUpdatePermission(context: EntityMainGridCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableUpdate;
  }

  export function HasDeletePermission(context: EntityMainGridCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableDelete;
  }

  export function HasSingleRecordSelected(
    context: EntityMainGridCommandContext
  ) {
    return context.primaryControl.selectedIds.length === 1;
  }

  export function HasAtLeastOneRecordSelected(
    context: EntityMainGridCommandContext
  ) {
    return context.primaryControl.selectedIds.length > 0;
  }
}

export namespace ViewCommandBuilder {
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
        context.navigation.openForm({
          logicalName: context.primaryControl.schema.logicalName,
        });
      },
      hidden: (context) => {
        if (!EnabledRules.HasCreatePermisssion(context)) {
          return true;
        }

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
        context.primaryControl.openRecord(
          context.primaryControl.selectedIds[0]
        );
      },
      hidden: [(context) => !EnabledRules.HasSingleRecordSelected(context)],
    };
  }

  export interface DeleteRecordCommandStringSet {
    confirmation: {
      title: string | [string, string];
      text: string | [string, string];
      buttonCancel: string;
      buttonConfirm: string;
    };
    status: {
      deleting: string | [string, string];
    };
    successNotification: {
      title: string | [string, string];
      text: string | [string, string];
    };
    errorNotification: {
      title: string;
    };
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

          for (const recordId of recordIds) {
            await context.dataService.deleteRecord(
              context.primaryControl.logicalName,
              recordId
            );
          }

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
      hidden: [
        (context) => !EnabledRules.HasAtLeastOneRecordSelected(context),
        (context) => !EnabledRules.HasDeletePermission(context),
      ],
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
            onClick: async (context) => {
              context.utility.showProgressIndicator('Exporting to Excel...');
              try {
                const result = await retriveRecords({
                  columnFilters: context.primaryControl.columnFilter,
                  dataService: context.dataService,
                  gridColumns: context.primaryControl.gridColumns,
                  schema: context.primaryControl.schema,
                  schemaStore: context.stores.schemaStore,
                  view: context.primaryControl.view,
                  search: context.primaryControl.searchText,
                  extraFilter: context.primaryControl.extraFilter,
                  sorting: context.primaryControl.sorting,
                  skip: 0,
                  limit: 5000,
                });

                await exportRecordsXLS({
                  fileName: context.primaryControl.view.name + '.xlsx',
                  gridColumns: context.primaryControl.gridColumns,
                  records: result.records,
                  schema: context.primaryControl.schema,
                  schemaStore: context.stores.schemaStore,
                });
              } finally {
                context.utility.hideProgressIndicator();
              }
            },
          },
          {
            Icon: csv.Icon,
            text: csv.text,
            localizedTexts: csv.localizedTexts,
            onClick: async (context) => {
              context.utility.showProgressIndicator('Exporting to CSV...');
              try {
                const result = await retriveRecords({
                  columnFilters: context.primaryControl.columnFilter,
                  dataService: context.dataService,
                  gridColumns: context.primaryControl.gridColumns,
                  schema: context.primaryControl.schema,
                  schemaStore: context.stores.schemaStore,
                  view: context.primaryControl.view,
                  search: context.primaryControl.searchText,
                  extraFilter: context.primaryControl.extraFilter,
                  sorting: context.primaryControl.sorting,
                  skip: 0,
                  limit: 5000,
                });

                await exportRecordsCSV({
                  fileName: context.primaryControl.view.name + '.csv',
                  gridColumns: context.primaryControl.gridColumns,
                  records: result.records,
                  schema: context.primaryControl.schema,
                  schemaStore: context.stores.schemaStore,
                });
              } finally {
                context.utility.hideProgressIndicator();
              }
            },
          },
        ],
      ],
    };
  }
}
