import { EntityMainFormCommandItemExperience } from '@headless-adminapp/core/experience/form';
import {
  EntityMainGridCommandItemExperience,
  SubGridCommandItemExperience,
} from '@headless-adminapp/core/experience/view';
import { Localized } from '@headless-adminapp/core/types';
import { Icon } from '@headless-adminapp/icons';

import { FormCommandBuilder } from './FormCommandBuilder';
import { SubgridCommandBuilder } from './SubgridCommandBuilder';
import { ViewCommandBuilder } from './ViewCommandBuilder';

export namespace DefaultCommandBuilder {
  interface CreateDefaultViewCommandStrings {
    new: string;
    edit: string;
    view: string;
    delete: string;
    refresh: string;
    export: string;
    exportCsv: string;
    exportExcel: string;
    deleteRecordCommandStringSet: ViewCommandBuilder.DeleteRecordCommandStringSet;
  }

  export const defaultViewCommandStrings: CreateDefaultViewCommandStrings = {
    new: 'New',
    edit: 'Edit',
    view: 'View',
    delete: 'Delete',
    deleteRecordCommandStringSet:
      ViewCommandBuilder.defaultDeleteRecordStringSet,
    refresh: 'Refresh',
    export: 'Export',
    exportCsv: 'CSV',
    exportExcel: 'Excel',
  };

  interface CreateDefaultViewCommandOptions {
    icons: {
      New: Icon;
      Edit: Icon;
      View: Icon;
      Delete: Icon;
      Refresh: Icon;
      Export: Icon;
      ExportCsv: Icon;
      ExportExcel: Icon;
    };
    strings?: CreateDefaultViewCommandStrings;
    localizedSrings?: Localized<CreateDefaultViewCommandStrings>;
  }

  function extractLocalizedStrings<T, U>(
    localizedStrings: Localized<T> | undefined,
    selector: (strings: T) => U,
  ): Localized<U> | undefined {
    if (!localizedStrings) {
      return;
    }

    return Object.keys(localizedStrings).reduce((p, key) => {
      p[key] = selector(localizedStrings[key]);

      return p;
    }, {} as Localized<U>);
  }

  export function createDefaultViewCommands({
    icons,
    strings = defaultViewCommandStrings,
    localizedSrings,
  }: CreateDefaultViewCommandOptions): EntityMainGridCommandItemExperience[][] {
    return [
      [
        ViewCommandBuilder.createNewRecordCommand({
          Icon: icons.New,
          text: strings.new,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.new,
          ),
        }),
        ViewCommandBuilder.createNewRecordForVirtualCommand({
          Icon: icons.New,
          text: strings.new,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.new,
          ),
        }),
        ViewCommandBuilder.createEditRecordCommand({
          Icon: icons.Edit,
          text: strings.edit,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.edit,
          ),
        }),
        ViewCommandBuilder.createViewRecordCommand({
          Icon: icons.View,
          text: strings.view,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.view,
          ),
        }),
        ViewCommandBuilder.createDeleteRecordCommand({
          Icon: icons.Delete,
          text: strings.delete,
          localizedText: extractLocalizedStrings(
            localizedSrings,
            (x) => x.delete,
          ),
          stringSet: strings.deleteRecordCommandStringSet,
          localizedStringSet: extractLocalizedStrings(
            localizedSrings,
            (x) => x.deleteRecordCommandStringSet,
          ),
        }),
        ViewCommandBuilder.createRefreshCommand({
          Icon: icons.Refresh,
          text: strings.refresh,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.refresh,
          ),
        }),
      ],
      [
        ViewCommandBuilder.createExportCommand({
          button: {
            Icon: icons.Export,
            text: strings.export,
            localizedTexts: extractLocalizedStrings(
              localizedSrings,
              (x) => x.export,
            ),
          },
          csv: {
            Icon: icons.ExportCsv,
            text: strings.exportCsv,
            localizedTexts: extractLocalizedStrings(
              localizedSrings,
              (x) => x.exportCsv,
            ),
          },
          excel: {
            Icon: icons.ExportExcel,
            text: strings.exportExcel,
            localizedTexts: extractLocalizedStrings(
              localizedSrings,
              (x) => x.exportExcel,
            ),
          },
        }),
      ],
    ];
  }

  interface CreateDefaultFormCommandStrings {
    save: string;
    saveAndClose: string;
    refresh: string;
    delete: string;
    deleteRecordCommandStringSet: FormCommandBuilder.DeleteRecordCommandStringSet;
  }

  interface CreateDefaultFormCommandOptions {
    icons: {
      Save: Icon;
      SaveAndClose: Icon;
      Refresh: Icon;
      Delete: Icon;
    };
    strings?: CreateDefaultFormCommandStrings;
    localizedSrings?: Localized<CreateDefaultFormCommandStrings>;
  }

  export const defaultFormCommandStrings: CreateDefaultFormCommandStrings = {
    save: 'Save',
    saveAndClose: 'Save & Close',
    refresh: 'Refresh',
    delete: 'Delete',
    deleteRecordCommandStringSet:
      FormCommandBuilder.defaultDeleteRecordStringSet,
  };

  export function createDefaultFormCommands({
    icons,
    strings = defaultFormCommandStrings,
    localizedSrings,
  }: CreateDefaultFormCommandOptions): EntityMainFormCommandItemExperience[][] {
    return [
      [
        FormCommandBuilder.createSaveCommand({
          Icon: icons.Save,
          text: strings.save,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.save,
          ),
        }),
        FormCommandBuilder.createSaveAndCloseCommand({
          Icon: icons.SaveAndClose,
          text: strings.saveAndClose,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.saveAndClose,
          ),
        }),
        FormCommandBuilder.createRefreshCommand({
          Icon: icons.Refresh,
          text: strings.refresh,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.refresh,
          ),
        }),
        FormCommandBuilder.createDeleteCommand({
          Icon: icons.Delete,
          text: 'Delete',
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.delete,
          ),
          stringSet: strings.deleteRecordCommandStringSet,
          localizedStringSet: extractLocalizedStrings(
            localizedSrings,
            (x) => x.deleteRecordCommandStringSet,
          ),
        }),
      ],
    ];
  }

  interface CreateDefaultSubgridCommandStrings {
    new: string;
    edit: string;
    view: string;
    delete: string;
    refresh: string;
    export: string;
    exportCsv: string;
    exportExcel: string;
    deleteRecordCommandStringSet: ViewCommandBuilder.DeleteRecordCommandStringSet;
  }

  interface CreateDefaultSubgridCommandOptions {
    icons: {
      New: Icon;
      Edit: Icon;
      View: Icon;
      Delete: Icon;
      Refresh: Icon;
      Export: Icon;
      ExportCsv: Icon;
      ExportExcel: Icon;
    };
    strings?: CreateDefaultSubgridCommandStrings;
    localizedSrings?: Localized<CreateDefaultSubgridCommandStrings>;
  }

  const defaultSubgridCommandStrings: CreateDefaultSubgridCommandStrings = {
    new: 'New',
    edit: 'Edit',
    view: 'View',
    delete: 'Delete',
    refresh: 'Refresh',
    export: 'Export',
    exportCsv: 'CSV',
    exportExcel: 'Excel',
    deleteRecordCommandStringSet:
      ViewCommandBuilder.defaultDeleteRecordStringSet,
  };

  export function createDefaultSubgridCommands({
    icons,
    strings = defaultSubgridCommandStrings,
    localizedSrings,
  }: CreateDefaultSubgridCommandOptions): SubGridCommandItemExperience[][] {
    return [
      [
        SubgridCommandBuilder.createNewRecordCommand({
          Icon: icons.New,
          text: strings.new,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.new,
          ),
        }),
        SubgridCommandBuilder.createEditRecordCommand({
          Icon: icons.Edit,
          text: strings.edit,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.edit,
          ),
        }),
        SubgridCommandBuilder.createViewRecordCommand({
          Icon: icons.View,
          text: strings.view,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.view,
          ),
        }),
        SubgridCommandBuilder.createDeleteRecordCommand({
          Icon: icons.Delete,
          text: strings.delete,
          localizedText: extractLocalizedStrings(
            localizedSrings,
            (x) => x.delete,
          ),
          stringSet: strings.deleteRecordCommandStringSet,
          localizedStringSet: extractLocalizedStrings(
            localizedSrings,
            (x) => x.deleteRecordCommandStringSet,
          ),
        }),
        SubgridCommandBuilder.createRefreshCommand({
          Icon: icons.Refresh,
          text: strings.refresh,
          localizedTexts: extractLocalizedStrings(
            localizedSrings,
            (x) => x.refresh,
          ),
        }),
      ],
      [
        SubgridCommandBuilder.createExportCommand({
          button: {
            Icon: icons.Export,
            text: strings.export,
            localizedTexts: extractLocalizedStrings(
              localizedSrings,
              (x) => x.export,
            ),
          },
          csv: {
            Icon: icons.ExportCsv,
            text: strings.exportCsv,
            localizedTexts: extractLocalizedStrings(
              localizedSrings,
              (x) => x.exportCsv,
            ),
          },
          excel: {
            Icon: icons.ExportExcel,
            text: strings.exportExcel,
            localizedTexts: extractLocalizedStrings(
              localizedSrings,
              (x) => x.exportExcel,
            ),
          },
        }),
      ],
    ];
  }

  type CreateDefaultCommandStrings = CreateDefaultViewCommandStrings &
    CreateDefaultFormCommandStrings &
    CreateDefaultSubgridCommandStrings;

  interface CreateDefaultCommandOptions {
    icons: CreateDefaultViewCommandOptions['icons'] &
      CreateDefaultFormCommandOptions['icons'] &
      CreateDefaultSubgridCommandOptions['icons'];
    strings?: CreateDefaultCommandStrings;
    localizedSrings?: Localized<CreateDefaultCommandStrings>;
  }

  const defaultCreateCommandStrings: CreateDefaultCommandStrings = {
    ...defaultViewCommandStrings,
    ...defaultFormCommandStrings,
    ...defaultSubgridCommandStrings,
  };

  export function createDefaultCommands({
    icons,
    strings = defaultCreateCommandStrings,
    localizedSrings,
  }: CreateDefaultCommandOptions) {
    return {
      view: createDefaultViewCommands({
        icons,
        strings,
        localizedSrings,
      }),
      form: createDefaultFormCommands({
        icons,
        strings,
        localizedSrings,
      }),
      subgrid: createDefaultSubgridCommands({
        icons,
        strings,
        localizedSrings,
      }),
    };
  }
}
