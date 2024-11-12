import { useAppContext } from '@headless-adminapp/app/app';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import { EntityMainGridCommandContext } from '@headless-adminapp/core/experience/view';
import { useMemo } from 'react';

import { useBaseCommandHandlerContext, useCommands } from '../../command';
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
import { useProgressIndicator } from '../../progress-indicator/hooks/useProgressIndicator';
import { useOpenToastNotification } from '../../toast-notification/hooks/useOpenToastNotification';
import { GridContext } from '../context';
import { useGridColumnFilter } from './useGridColumnFilter';
import { useGridColumns } from './useGridColumns';
import { useGridData } from './useGridData';
import { useGridExtraFilter } from './useGridExtraFilter';
import { useGridRefresh } from './useGridRefresh';
import { useDataGridSchema } from './useGridSchema';
import { useGridSelection } from './useGridSelection';
import { useGridSorting } from './useGridSorting';
import { useOpenRecord } from './useOpenRecord';
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

export function useGridControlContext(): EntityMainGridCommandContext['primaryControl'] {
  const data = useGridData();
  const schema = useDataGridSchema();
  const view = useSelectedView();
  const [searchText] = useSearchText();
  const [selectedIds] = useGridSelection();
  const [columnFilter] = useGridColumnFilter();
  const extraFilter = useGridExtraFilter();
  const refresh = useGridRefresh();
  const openRecord = useOpenRecord();
  const gridColumns = useGridColumns();
  const [sorting] = useGridSorting();

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
    openRecord,
    gridColumns,
    sorting,
  };
}

export function useMainGridCommandHandlerContext(): EntityMainGridCommandContext {
  const baseHandlerContext = useBaseCommandHandlerContext();

  const primaryControl = useGridControlContext();

  return {
    ...baseHandlerContext,
    primaryControl,
  };
}

const emptyCommands: CommandItemExperience<EntityMainGridCommandContext>[][] =
  [];

function useGridCommands() {
  const commands = useContextSelector(
    GridContext,
    (state) =>
      state.commands as
        | CommandItemExperience<EntityMainGridCommandContext>[][]
        | undefined
  );
  const {
    app: { viewCommands: defaultCommands },
  } = useAppContext();

  return commands ?? defaultCommands ?? emptyCommands;
}

export function useMainGridCommands(): CommandItemState[][] {
  const commands = useGridCommands();
  const handlerContext = useMainGridCommandHandlerContext();

  return useCommands<EntityMainGridCommandContext>(commands, handlerContext);
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
