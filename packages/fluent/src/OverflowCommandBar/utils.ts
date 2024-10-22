import { MenuItemCommandState } from '@headless-adminapp/app/command';
import { ArrayWithAtLeastOne } from '@headless-adminapp/core/types';

import { MenuItemProps } from '../CommandBar/MenuItem';

function transformMenuItem(
  item: MenuItemCommandState,
  language: string
): MenuItemProps {
  return {
    Icon: item.Icon,
    text: item.localizedTexts?.[language] ?? item.text ?? '',
    danger: item.danger,
    onClick: item.onClick,
    disabled: item.disabled,
    items: item.items?.map((x) => transformMenuItems(x, language)),
  } as MenuItemProps;
}

export function transformMenuItems(
  items: ArrayWithAtLeastOne<MenuItemCommandState>,
  language: string
): ArrayWithAtLeastOne<MenuItemProps> {
  return items.map((x: MenuItemCommandState) =>
    transformMenuItem(x, language)
  ) as ArrayWithAtLeastOne<MenuItemProps>;
}
