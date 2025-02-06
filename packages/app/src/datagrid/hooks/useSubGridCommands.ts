import { useAppContext } from '@headless-adminapp/app/app';
import { useRecordTitle } from '@headless-adminapp/app/dataform';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import { EntitySubGridCommandContext } from '@headless-adminapp/core/experience/view';

import { useBaseCommandHandlerContext, useCommands } from '../../command';
import { CommandItemState, MenuItemCommandState } from '../../command/types';
import { useMainFormCommandHandlerContext } from '../../dataform/hooks/useMainFormCommands';
import { GridContext } from '../context';
import { useGridControlContext } from './useMainGridCommands';

export function useSubGridCommandHandlerContext(): EntitySubGridCommandContext {
  const baseHandlerContext = useBaseCommandHandlerContext();

  const mainFormHandlerContext = useMainFormCommandHandlerContext();
  const gridControl = useGridControlContext();

  const associated = useContextSelector(
    GridContext,
    (state) => state.associated
  );
  const [recordTitle] = useRecordTitle();

  return {
    ...baseHandlerContext,
    primaryControl: mainFormHandlerContext.primaryControl,
    secondaryControl: {
      ...gridControl,
      associated: !associated
        ? false
        : {
            id: associated.id,
            logicalName: associated.logicalName,
            name: recordTitle,
            refAttributeName: associated.refAttributeName,
          },
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
