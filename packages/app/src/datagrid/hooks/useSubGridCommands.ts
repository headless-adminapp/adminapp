import { useAppContext } from '@headless-adminapp/app/app';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import { EntitySubGridCommandContext } from '@headless-adminapp/core/experience/view';
import { useMemo } from 'react';

import { useBaseCommandHandlerContext, useCommands } from '../../command';
import { CommandItemState, MenuItemCommandState } from '../../command/types';
import { useMainFormCommandHandlerContext } from '../../dataform/hooks/useMainFormCommands';
import { GridContext } from '../context';
import { useGridColumnFilter } from './useGridColumnFilter';
import { useGridData } from './useGridData';
import { useGridExtraFilter } from './useGridExtraFilter';
import { useGridRefresh } from './useGridRefresh';
import { useDataGridSchema } from './useGridSchema';
import { useGridSelection } from './useGridSelection';
import { useSearchText } from './useSearchText';
import { useSelectedView } from './useSelectedView';

export function useSubGridCommandHandlerContext(): EntitySubGridCommandContext {
  const baseHandlerContext = useBaseCommandHandlerContext();

  const data = useGridData();
  const schema = useDataGridSchema();
  const view = useSelectedView();
  const [searchText] = useSearchText();
  const [selectedIds] = useGridSelection();

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

  const [columnFilter] = useGridColumnFilter();
  const extraFilter = useGridExtraFilter();

  const refresh = useGridRefresh();

  const mainFormHandlerContext = useMainFormCommandHandlerContext();

  return {
    ...baseHandlerContext,
    primaryControl: mainFormHandlerContext.primaryControl,
    secondaryControl: {
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
    },
  };
}

const emptyCommands: CommandItemExperience<EntitySubGridCommandContext>[][] =
  [];

function useGridCommands() {
  const commands = useContextSelector(
    GridContext,
    (state) =>
      state.commands as
        | CommandItemExperience<EntitySubGridCommandContext>[][]
        | undefined
  );
  const {
    app: { subgridCommands: defaultCommands },
  } = useAppContext();

  return commands ?? defaultCommands ?? emptyCommands;
}

export function useSubGridCommands(): CommandItemState[][] {
  const commands = useGridCommands();
  const handlerContext = useSubGridCommandHandlerContext();

  return useCommands<EntitySubGridCommandContext>(commands, handlerContext);
}

export function useSubGridContextCommands(): MenuItemCommandState[][] {
  const commands = useGridCommands();
  const handlerContext = useSubGridCommandHandlerContext();

  return useCommands<EntitySubGridCommandContext>(
    commands,
    handlerContext,
    (command) => ('isContextMenu' in command && command.isContextMenu) ?? false
  ) as MenuItemCommandState[][];
}
