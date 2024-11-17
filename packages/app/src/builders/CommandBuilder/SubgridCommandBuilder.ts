import {
  EntitySubGridCommandContext,
  SubGridCommandItemExperience,
} from '@headless-adminapp/core/experience/view';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

import { exportRecordsCSV, exportRecordsXLS, retriveRecords } from '../utils';
import { createLocalizedSelector } from './utils';
import { ViewCommandBuilder } from './ViewCommandBuilder';

namespace EnabledRules {
  export function HasCreatePermisssion(context: EntitySubGridCommandContext) {
    return !context.secondaryControl.schema.restrictions?.disableCreate;
  }

  export function HasUpdatePermission(context: EntitySubGridCommandContext) {
    return !context.secondaryControl.schema.restrictions?.disableUpdate;
  }

  export function HasDeletePermission(context: EntitySubGridCommandContext) {
    return !context.secondaryControl.schema.restrictions?.disableDelete;
  }

  export function HasSingleRecordSelected(
    context: EntitySubGridCommandContext
  ) {
    return context.secondaryControl.selectedIds.length === 1;
  }

  export function HasAtLeastOneRecordSelected(
    context: EntitySubGridCommandContext
  ) {
    return context.secondaryControl.selectedIds.length > 0;
  }
}

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
        if (context.secondaryControl.associated) {
          context.navigation.openForm({
            logicalName: context.secondaryControl.schema.logicalName,
            parameters: {
              [context.secondaryControl.associated.refAttributeName]: {
                id: context.secondaryControl.associated.id,
                logicalName: context.secondaryControl.associated.logicalName,
                name: context.secondaryControl.associated.name,
              },
            },
          });
        } else {
          context.navigation.openForm({
            logicalName: context.secondaryControl.schema.logicalName,
          });
        }
      },
      hidden: (context) => !EnabledRules.HasCreatePermisssion(context),
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
        context.secondaryControl.openRecord(
          context.secondaryControl.selectedIds[0]
        );
      },
      hidden: [(context) => !EnabledRules.HasSingleRecordSelected(context)],
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

  export function createDeleteRecordCommand({
    Icon,
    localizedText,
    text,
    stringSet = ViewCommandBuilder.defaultDeleteRecordStringSet,
    localizedStringSet,
  }: {
    Icon: Icon;
    text: string;
    localizedText?: Record<string, string>;
    stringSet?: ViewCommandBuilder.DeleteRecordCommandStringSet;
    localizedStringSet?: Localized<ViewCommandBuilder.DeleteRecordCommandStringSet>;
  }): SubGridCommandItemExperience {
    return {
      type: 'button',
      Icon,
      text,
      localizedText,
      danger: true,
      isContextMenu: true,
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

          for (const recordId of recordIds) {
            await context.dataService.deleteRecord(
              context.secondaryControl.logicalName,
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

          context.secondaryControl.refresh();
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
            onClick: async (context) => {
              context.utility.showProgressIndicator('Exporting to Excel...');
              try {
                const result = await retriveRecords({
                  columnFilters: context.secondaryControl.columnFilter,
                  dataService: context.dataService,
                  gridColumns: context.secondaryControl.gridColumns,
                  schema: context.secondaryControl.schema,
                  schemaStore: context.stores.schemaStore,
                  view: context.secondaryControl.view,
                  search: context.secondaryControl.searchText,
                  extraFilter: context.secondaryControl.extraFilter,
                  sorting: context.secondaryControl.sorting,
                  skip: 0,
                  limit: 5000,
                });

                await exportRecordsXLS({
                  fileName: context.secondaryControl.view.name + '.xlsx',
                  gridColumns: context.secondaryControl.gridColumns,
                  records: result.records,
                  schema: context.secondaryControl.schema,
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
                  columnFilters: context.secondaryControl.columnFilter,
                  dataService: context.dataService,
                  gridColumns: context.secondaryControl.gridColumns,
                  schema: context.secondaryControl.schema,
                  schemaStore: context.stores.schemaStore,
                  view: context.secondaryControl.view,
                  search: context.secondaryControl.searchText,
                  extraFilter: context.secondaryControl.extraFilter,
                  sorting: context.secondaryControl.sorting,
                  skip: 0,
                  limit: 5000,
                });

                await exportRecordsCSV({
                  fileName: context.secondaryControl.view.name + '.csv',
                  gridColumns: context.secondaryControl.gridColumns,
                  records: result.records,
                  schema: context.secondaryControl.schema,
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
