import { CommandItemExperience } from '@headless-adminapp/core/experience/command';
import { useMemo, useRef } from 'react';

import { CommandItemExperienceSelector, CommandItemState } from '../types';
import { transformCommadnGroups } from '../utils';

/***
 * @description Transforms the command configuration into a format that can be used by the CommandBar component
 *              and apply the necessary conditions to the commands (disabled, hidden, etc.)
 */
export function useCommands<HandlerContext>(
  commands: CommandItemExperience<HandlerContext>[][],
  handlerContext: HandlerContext,
  selector?: CommandItemExperienceSelector<HandlerContext>
): CommandItemState[][] {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  return useMemo(() => {
    return transformCommadnGroups(
      commands,
      handlerContext,
      selectorRef.current
    );
  }, [commands, handlerContext]);
}
