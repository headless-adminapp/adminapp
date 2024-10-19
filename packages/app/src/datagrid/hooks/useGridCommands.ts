import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import {
  EntityMainGridCommandContext,
  EntitySubGridCommandContext,
} from '@headless-adminapp/core/experience/view';

import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridCommands<
  CommandContext extends
    | EntityMainGridCommandContext
    | EntitySubGridCommandContext = EntityMainGridCommandContext
>(): CommandItemExperience<CommandContext>[][] {
  const commands = useContextSelector(
    GridContext,
    (state) => state.commands as CommandItemExperience<CommandContext>[][]
  );

  return commands;
}
