import { EntitySubGridCommandContext } from '@headless-adminapp/core/experience/view';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useCommands } from '../../command';
import { CommandItemState, MenuItemCommandState } from '../../command/types';
import { useMainFormCommandHandlerContext } from '../../dataform/hooks/useMainFormCommands';
import { useLocale } from '../../locale/useLocale';
import { useMetadata } from '../../metadata/hooks/useMetadata';
import { useDataService } from '../../transport';
import { useGridColumnFilter } from './useGridColumnFilter';
import { useGridCommands } from './useGridCommands';
import { useGridData } from './useGridData';
import { useGridExtraFilter } from './useGridExtraFilter';
import { useGridRefresh } from './useGridRefresh';
import { useDataGridSchema } from './useGridSchema';
import { useGridSelection } from './useGridSelection';
import { useUtility } from './useMainGridCommands';
import { useSearchText } from './useSearchText';
import { useSelectedView } from './useSelectedView';

export function useSubGridCommandHandlerContext(): EntitySubGridCommandContext {
  const dataService = useDataService();
  const queryClient = useQueryClient();
  const { appStore, experienceStore, schemaStore } = useMetadata();

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
  const utility = useUtility();
  const [locale] = useLocale();

  const mainFormHandlerContext = useMainFormCommandHandlerContext();

  // console.log('mainFormHandlerContext', mainFormHandlerContext);

  return {
    dataService,
    queryClient,
    utility,
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
    stores: {
      appStore,
      experienceStore,
      schemaStore,
    },
    locale,
  };
}

export function useSubGridCommands(): CommandItemState[][] {
  const commands = useGridCommands<EntitySubGridCommandContext>();
  const handlerContext = useSubGridCommandHandlerContext();

  console.log('temp. commands (s)', commands);
  console.log('temp. handlerContext (s)', handlerContext);

  return useCommands<EntitySubGridCommandContext>(commands, handlerContext);
}

export function useSubGridContextCommands(): MenuItemCommandState[][] {
  const commands = useGridCommands<EntitySubGridCommandContext>();
  const handlerContext = useSubGridCommandHandlerContext();

  return useCommands<EntitySubGridCommandContext>(
    commands,
    handlerContext,
    (command) => ('isContextMenu' in command && command.isContextMenu) ?? false
  ) as MenuItemCommandState[][];
}
