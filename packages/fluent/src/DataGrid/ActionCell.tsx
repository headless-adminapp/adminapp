import { MenuItemCommandState } from '@headless-adminapp/app/command';
import { useLocale } from '@headless-adminapp/app/locale';
import {
  MutableState,
  useMutableStateSelector,
} from '@headless-adminapp/app/mutable';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';
import { memo } from 'react';

import { MenuItemProps } from '../CommandBar/MenuItem';
import { transformMenuItems } from '../OverflowCommandBar';
import { TableCellAction } from './TableCell';

interface ActionCellProps {
  onOpen: () => void;
  mutableState: MutableState<MenuItemCommandState[][]>;
}

export const ActionCell = memo(function ActionCell({
  onOpen,
  mutableState,
}: ActionCellProps) {
  const transformedCommands = useMutableStateSelector(
    mutableState,
    (state) => state
  ) as ArrayGroupWithAtLeastOne<MenuItemCommandState>;
  const { language } = useLocale();

  return (
    <TableCellAction
      onOpen={onOpen}
      items={
        transformedCommands.map((item) =>
          transformMenuItems(item, language)
        ) as ArrayGroupWithAtLeastOne<MenuItemProps>
      }
    />
  );
});

ActionCell.displayName = 'ActionCell';
