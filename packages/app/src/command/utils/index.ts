import {
  CommandItemExperience,
  MenuItemCommandExperience,
} from '@headless-adminapp/core/experience/command';
import { checkCommandCondition } from '@headless-adminapp/core/experience/command/utils';
import {
  ArrayGroupWithAtLeastOne,
  ArrayWithAtLeastOne,
} from '@headless-adminapp/core/types';

import {
  CommandItemExperienceSelector,
  CommandItemState,
  MenuItemCommandState,
} from '../types';

function transformedProperties<HandlerContext>(
  command: Pick<
    CommandItemExperience<HandlerContext>,
    'Icon' | 'disabled' | 'onClick' | 'hidden'
  >,
  handlerContext: HandlerContext
) {
  const IconComponent = command.Icon;

  const hidden = checkCommandCondition(handlerContext, command.hidden);

  const disabled = checkCommandCondition(handlerContext, command.disabled);

  const onClick = command.onClick
    ? () => {
        command.onClick!(handlerContext)?.catch(console.error);
      }
    : undefined;

  return {
    Icon: IconComponent,
    hidden,
    disabled,
    onClick,
  };
}

function transformCommand<HandlerContext>(
  command: CommandItemExperience<HandlerContext>,
  handlerContext: HandlerContext
): CommandItemState {
  const commandType = command.type;

  switch (command.type) {
    case 'icon':
      return {
        type: command.type,
        isQuickAction: command.isQuickAction,
        danger: command.danger,
        iconPosition: command.iconPosition,
        ...transformedProperties(command, handlerContext),
      } as CommandItemState;
    case 'button':
      return {
        type: command.type,
        isQuickAction: command.isQuickAction,
        text: command.text,
        danger: command.danger,
        iconPosition: command.iconPosition,
        localizedTexts: command.localizedText,
        ...transformedProperties(command, handlerContext),
      } as CommandItemState;
    case 'menu':
      return {
        type: command.type,
        text: command.text,
        danger: command.danger,
        localizedTexts: command.localizedTexts,
        iconPosition: command.iconPosition,
        ...transformedProperties(command, handlerContext),
        items: command.items.map((item) =>
          transformMenuItems(item, handlerContext)
        ),
      } as CommandItemState;
    default:
      throw new Error(`Unknown command type: ${commandType}`);
  }
}

function transformMenuItems<HandlerContext>(
  items: ArrayWithAtLeastOne<MenuItemCommandExperience<HandlerContext>>,
  handlerContext: HandlerContext
): ArrayWithAtLeastOne<MenuItemCommandState> {
  return items.map((item) =>
    transformMenuItem(item, handlerContext)
  ) as ArrayWithAtLeastOne<MenuItemCommandState>;
}

function transformMenuItem<HandlerContext>(
  item: MenuItemCommandExperience<HandlerContext>,
  handlerContext: HandlerContext
): MenuItemCommandState {
  return {
    danger: item.danger,
    text: item.text,
    localizedTexts: item.localizedTexts,
    ...transformedProperties(item, handlerContext),
    items: item.items?.map((item) =>
      transformMenuItems(item, handlerContext)
    ) as ArrayGroupWithAtLeastOne<MenuItemCommandState>,
  };
}

function transformCommandGroup<HandlerContext>(
  group: CommandItemExperience<HandlerContext>[],
  handlerContext: HandlerContext,
  selector?: CommandItemExperienceSelector<HandlerContext>
): CommandItemState[] {
  return group
    .map((command) => {
      if (!(selector?.(command) ?? true)) {
        return false; // Skip command
      }

      const transformedCommand = transformCommand(command, handlerContext);

      if (transformedCommand.hidden) {
        return false; // Skip command
      }

      return transformedCommand;
    })
    .filter(Boolean) as CommandItemState[];
}

export function transformCommadnGroups<HandlerContext>(
  groups: CommandItemExperience<HandlerContext>[][],
  handlerContext: HandlerContext,
  selector?: CommandItemExperienceSelector<HandlerContext>
): CommandItemState[][] {
  return groups
    .map((group) => {
      return transformCommandGroup(group, handlerContext, selector);
    })
    .filter((group) => group.length > 0);
}
