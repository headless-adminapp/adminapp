import {
  EntityMainGridCommandContext,
  EntityMainGridCommandItemExperience,
} from '@headless-adminapp/core/experience/view';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

import { exportRecordsCSV, exportRecordsXLS, retriveRecords } from '../utils';
import { createLocalizedSelector, plurialize } from './utils';

export namespace EnabledRules {
  export function HasCreatePermisssion(context: EntityMainGridCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableCreate;
  }

  export function HasUpdatePermission(context: EntityMainGridCommandContext) {
    return !context.primaryControl.schema.restrictions?.disableUpdate;
  }

  export function HasDeletePermission(context: EntityMainGridCommandContext) {
    if (context.primaryControl.schema.restrictions?.disableDelete) {
      return false;
    }

    if (context.primaryControl.schema.virtual) {
      const baseSchemaLogicalName =
        context.primaryControl.schema.virtual.baseSchemaLogicalName;
      const virtualLogicalNameAttribute =
        context.primaryControl.schema.virtual.baseSchemaLogicalNameAttribute;

      if (!baseSchemaLogicalName && !virtualLogicalNameAttribute) {
        return false;
      }

      if (baseSchemaLogicalName) {
        const baseSchema = context.stores.schemaStore.getSchema(
          baseSchemaLogicalName,
        );

        if (!baseSchema) {
          return false;
        }

        if (baseSchema.restrictions?.disableDelete) {
          return false;
        }
      } else if (virtualLogicalNameAttribute) {
        const logicalNames = Array.from(
          new Set(context.primaryControl.selectedRecords.map((x) => x.$entity)),
        );

        const schemas = logicalNames.map((x) =>
          context.stores.schemaStore.getSchema(x),
        );

        if (
          !schemas.length ||
          schemas.some((x) => x.restrictions?.disableDelete) ||
          schemas.some((x) => x.virtual)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  export function HasSingleRecordSelected(
    context: EntityMainGridCommandContext,
  ) {
    return context.primaryControl.selectedIds.length === 1;
  }

  export function HasAtLeastOneRecordSelected(
    context: EntityMainGridCommandContext,
  ) {
    return context.primaryControl.selectedIds.length > 0;
  }

  export function IsPhysicalSchema(context: EntityMainGridCommandContext) {
    return !context.primaryControl.schema.virtual;
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
      isQuickAction: true,
      onClick: (context) => {
        context.navigation.openForm({
          logicalName: context.primaryControl.schema.logicalName,
        });
      },
      hidden: (context) => {
        if (!EnabledRules.HasCreatePermisssion(context)) {
          return true;
        }

        if (!EnabledRules.IsPhysicalSchema(context)) {
          return true;
        }

        return false;
      },
    };
  }

  export function createNewRecordForVirtualCommand({
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
      onClick: async (context) => {
        if (
          !context.primaryControl.schema.virtual?.baseSchemaLogicalNames?.length
        ) {
          return;
        }

        const data = await context.utility.openPromptDialog({
          title: 'Select type',
          attributes: {
            type: {
              type: 'choice',
              label: 'Select type',
              string: true,
              required: true,
              options:
                context.primaryControl.schema.virtual.baseSchemaLogicalNames?.map(
                  (x) => {
                    const schema = context.stores.schemaStore.getSchema(x);

                    return {
                      value: x,
                      label: schema.label,
                    };
                  },
                ),
            },
          },
          defaultValues: {},
        });

        if (!data) {
          return;
        }

        context.navigation.openForm({
          logicalName: data.type,
        });
      },
      hidden: (context) => {
        if (EnabledRules.IsPhysicalSchema(context)) {
          return true;
        }

        if (
          !context.primaryControl.schema.virtual?.baseSchemaLogicalNames?.length
        ) {
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
        if (EnabledRules.IsPhysicalSchema(context)) {
          context.primaryControl.openRecord(
            context.primaryControl.selectedIds[0],
            context.primaryControl.schema.logicalName,
          );
        } else {
          if (
            !context.primaryControl.schema.virtual
              ?.baseSchemaLogicalNameAttribute
          ) {
            return;
          }

          const logicalName = (
            context.primaryControl.selectedRecords[0] as any
          )[
            context.primaryControl.schema.virtual
              ?.baseSchemaLogicalNameAttribute
          ];

          if (!logicalName) {
            return;
          }

          context.primaryControl.openRecord(
            context.primaryControl.selectedIds[0],
            logicalName,
          );
        }
      },
      hidden: [
        (context) => !EnabledRules.HasSingleRecordSelected(context),
        (context) => {
          if (EnabledRules.IsPhysicalSchema(context)) {
            return false;
          }

          if (
            !context.primaryControl.schema.virtual
              ?.baseSchemaLogicalNameAttribute
          ) {
            return true;
          }

          const logicalName = (
            context.primaryControl.selectedRecords[0] as any
          )[
            context.primaryControl.schema.virtual
              ?.baseSchemaLogicalNameAttribute
          ];

          if (!logicalName) {
            return true;
          }

          return false;
        },
      ],
    };
  }

  export function createViewRecordCommand({
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
          context.primaryControl.selectedIds[0],
          context.primaryControl.schema.logicalName,
        );
      },
      hidden: [
        (context) => !EnabledRules.HasSingleRecordSelected(context),
        (context) => {
          if (EnabledRules.IsPhysicalSchema(context)) {
            return true;
          }

          if (
            context.primaryControl.schema.virtual
              ?.baseSchemaLogicalNameAttribute ||
            context.primaryControl.schema.virtual?.baseSchemaLogicalName
          ) {
            return true;
          }

          return false;
        },
      ],
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
        await processDeleteRecordRequest(context, {
          stringSet,
          localizedStringSet,
        });
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
              await exportRecordsToExcel(context);
            },
          },
          {
            Icon: csv.Icon,
            text: csv.text,
            localizedTexts: csv.localizedTexts,
            onClick: async (context) => {
              await exportRecordsToCSV(context);
            },
          },
        ],
      ],
    };
  }
}

async function retrieveFilteredRecords(context: EntityMainGridCommandContext) {
  return retriveRecords({
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
}

export async function exportRecordsToExcel(
  context: EntityMainGridCommandContext,
) {
  context.utility.showProgressIndicator('Exporting to Excel...');
  try {
    const result = await retrieveFilteredRecords(context);

    await exportRecordsXLS({
      fileName: context.primaryControl.view.name + '.xlsx',
      gridColumns: context.primaryControl.gridColumns,
      records: result.records,
      attributes: context.primaryControl.schema.attributes,
      schemaStore: context.stores.schemaStore,
      locale: context.locale,
    });
  } finally {
    context.utility.hideProgressIndicator();
  }
}

export async function exportRecordsToCSV(
  context: EntityMainGridCommandContext,
) {
  context.utility.showProgressIndicator('Exporting to CSV...');
  try {
    const result = await retrieveFilteredRecords(context);

    await exportRecordsCSV({
      fileName: context.primaryControl.view.name + '.csv',
      gridColumns: context.primaryControl.gridColumns,
      records: result.records,
      attributes: context.primaryControl.schema.attributes,
      schemaStore: context.stores.schemaStore,
      locale: context.locale,
    });
  } finally {
    context.utility.hideProgressIndicator();
  }
}

export async function processDeleteRecordRequest(
  context: EntityMainGridCommandContext,
  {
    stringSet,
    localizedStringSet,
  }: {
    stringSet: ViewCommandBuilder.DeleteRecordCommandStringSet;
    localizedStringSet?: Localized<ViewCommandBuilder.DeleteRecordCommandStringSet>;
  },
) {
  const recordIds = context.primaryControl.selectedIds;

  if (!recordIds.length) {
    return;
  }

  let logicalName = context.primaryControl.schema.logicalName;

  if (context.primaryControl.schema.virtual) {
    const baseSchemaLogicalName =
      context.primaryControl.schema.virtual.baseSchemaLogicalName;

    if (!baseSchemaLogicalName) {
      return;
    }

    const baseSchema = context.stores.schemaStore.getSchema(
      baseSchemaLogicalName,
    );

    if (!baseSchema) {
      return;
    }

    logicalName = baseSchema.logicalName;
  }

  const localizeSelector = createLocalizedSelector(
    stringSet,
    localizedStringSet,
    context.locale.language,
  );

  try {
    const confirmResult = await context.utility.openConfirmDialog({
      title: plurialize(
        recordIds.length,
        localizeSelector((s) => s.confirmation.title),
      ),
      text: plurialize(
        recordIds.length,
        localizeSelector((s) => s.confirmation.text),
      ),
      cancelButtonLabel: localizeSelector((s) => s.confirmation.buttonCancel),
      confirmButtonLabel: localizeSelector((s) => s.confirmation.buttonConfirm),
    });

    if (!confirmResult?.confirmed) {
      return;
    }

    context.utility.showProgressIndicator(
      plurialize(
        recordIds.length,
        localizeSelector((s) => s.status.deleting),
      ) + '...',
    );

    for (const recordId of recordIds) {
      await context.dataService.deleteRecord(logicalName, recordId);
    }

    context.utility.showNotification({
      title: plurialize(
        recordIds.length,
        localizeSelector((s) => s.successNotification.title),
      ),
      text: plurialize(
        recordIds.length,
        localizeSelector((s) => s.successNotification.text),
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
}
