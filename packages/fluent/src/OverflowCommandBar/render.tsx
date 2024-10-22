import { CommandItemState } from '@headless-adminapp/app/command';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';

import CommandBar from '../CommandBar';
import { CommandMenuButton } from '../CommandBar/MenuButton';
import { MenuItemProps } from '../CommandBar/MenuItem';
import { transformMenuItems } from './utils';

export function renderCommandItem(
  key: string | number,
  item: CommandItemState,
  language: string
) {
  const commandType = item.type;

  switch (item.type) {
    case 'menu':
      return (
        <CommandMenuButton
          key={key}
          Icon={item.Icon}
          text={item.localizedTexts?.[language] ?? item.text ?? ''}
          danger={item.danger}
          disabled={item.disabled}
          onClick={item.onClick}
          items={
            item.items?.map((x) =>
              transformMenuItems(x, language)
            ) as ArrayGroupWithAtLeastOne<MenuItemProps>
          }
        />
      );
    case 'button':
      return (
        <CommandBar.Button
          key={key}
          text={item.localizedTexts?.[language] ?? item.text ?? ''}
          Icon={item.Icon}
          iconPosition={item.iconPosition ?? 'before'}
          danger={item.danger}
          disabled={item.disabled}
          onClick={item.onClick}
        />
      );
    case 'label':
      return (
        <CommandBar.Label
          key={key}
          text={item.localizedTexts?.[language] ?? item.text ?? ''}
          Icon={item.Icon}
        />
      );

    case 'icon':
      return (
        <CommandBar.IconButton
          key={key}
          Icon={item.Icon}
          danger={item.danger}
          disabled={item.disabled}
          onClick={item.onClick}
        />
      );

    default:
      throw new Error(`Unknown command type: ${commandType}`);
  }
}
