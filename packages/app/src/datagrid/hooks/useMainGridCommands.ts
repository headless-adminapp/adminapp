import { EntityMainGridCommandContext } from '@headless-adminapp/core/experience/view';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useCommands } from '../../command';
import {
  CommandItemState,
  MenuItemCommandState,
  UtilityContextState,
} from '../../command/types';
import {
  useOpenAlertDialog,
  useOpenConfirmDialog,
  useOpenErrorDialog,
  useOpenPromptDialog,
} from '../../dialog/hooks';
import { useLocale } from '../../locale/useLocale';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useProgressIndicator } from '../../progress-indicator/hooks/useProgressIndicator';
import { useOpenToastNotification } from '../../toast-notification/hooks/useOpenToastNotification';
import { useDataService } from '../../transport';
import { useGridColumnFilter } from './useGridColumnFilter';
import { useGridCommands } from './useGridCommands';
import { useGridData } from './useGridData';
import { useGridExtraFilter } from './useGridExtraFilter';
import { useGridRefresh } from './useGridRefresh';
import { useDataGridSchema } from './useGridSchema';
import { useGridSelection } from './useGridSelection';
import { useSearchText } from './useSearchText';
import { useSelectedView } from './useSelectedView';

export function useUtility(): UtilityContextState {
  const { hideProgressIndicator, showProgressIndicator } =
    useProgressIndicator();
  const openAlertDialog = useOpenAlertDialog();
  const openConfirmDialog = useOpenConfirmDialog();
  const openErrorDialog = useOpenErrorDialog();
  const openPromptDialog = useOpenPromptDialog();
  const openToastNotification = useOpenToastNotification();

  return {
    hideProgressIndicator,
    showProgressIndicator,
    openAlertDialog,
    openConfirmDialog: openConfirmDialog as any,
    openErrorDialog,
    openPromptDialog: openPromptDialog as any,
    showNotification: openToastNotification,
  };
}

export function useGridControlContext() {
  const data = useGridData();
  const schema = useDataGridSchema();
  const view = useSelectedView();
  const [searchText] = useSearchText();
  const [selectedIds] = useGridSelection();
  const [columnFilter] = useGridColumnFilter();
  const extraFilter = useGridExtraFilter();
  const refresh = useGridRefresh();

  const selectedIdsObj = useMemo(() => {
    const obj: Record<string, boolean> = {};
    selectedIds.forEach((id) => {
      obj[id] = true;
    });
    return obj;
  }, [selectedIds]);

  const selectedRecords = useMemo(() => {
    return (data?.records ?? []).filter(
      (record) => selectedIdsObj[record[schema.idAttribute as string] as string]
    );
  }, [data, schema, selectedIdsObj]);

  return {
    data,
    logicalName: schema.logicalName,
    schema,
    refresh,
    searchText,
    selectedIds,
    selectedRecords,
    view,
    viewId: view.id,
    columnFilter,
    extraFilter,
  };
}

export function useMainGridCommandHandlerContext(): EntityMainGridCommandContext {
  const dataService = useDataService();
  const queryClient = useQueryClient();
  const { appStore, experienceStore, schemaStore } = useMetadata();

  const utility = useUtility();
  const locale = useLocale();

  const primaryControl = useGridControlContext();

  return {
    dataService,
    queryClient,
    utility,
    primaryControl,
    stores: {
      appStore,
      experienceStore,
      schemaStore,
    },
    locale,
  };
}

export function useMainGridCommands(): CommandItemState[][] {
  const commands = useGridCommands();
  const handlerContext = useMainGridCommandHandlerContext();

  // console.log('temp. gc', commands);

  return useCommands<EntityMainGridCommandContext>(commands, handlerContext);

  // return [
  //   [
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Delete',
  //       text: 'Delete',
  //       danger: true,
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //   ],
  //   [
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'menu',
  //       icon: 'Add',
  //       text: 'Report',
  //       danger: true,
  //       handlerId: 'report',
  //       items: [
  //         {
  //           icon: 'Add',
  //           text: 'Export',
  //           danger: true,
  //         },
  //       ],
  //     },
  //     {
  //       type: 'menu',
  //       icon: 'Add',
  //       text: 'Report',
  //       danger: true,
  //       items: [
  //         {
  //           icon: 'Add',
  //           text: 'Export',
  //           danger: true,
  //         },
  //       ],
  //     },
  //   ],
  //   [
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //     {
  //       type: 'button',
  //       icon: 'Add',
  //       text: 'Add',
  //     },
  //   ],
  // ];
}

export function useMainGridContextCommands(): MenuItemCommandState[][] {
  const commands = useGridCommands();
  const handlerContext = useMainGridCommandHandlerContext();

  return useCommands<EntityMainGridCommandContext>(
    commands,
    handlerContext,
    (command) => ('isContextMenu' in command && command.isContextMenu) ?? false
  ) as MenuItemCommandState[][];
}
