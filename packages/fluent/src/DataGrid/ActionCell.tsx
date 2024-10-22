import { MenuItemCommandState } from '@headless-adminapp/app/command';
import {
  MutableState,
  useMutableStateSelector,
} from '@headless-adminapp/app/mutable';
import { ArrayGroupWithAtLeastOne } from '@headless-adminapp/core/types';

import { MenuItemProps } from '../CommandBar/MenuItem';
import { TableCellAction } from '../DataGrid/TableCell';
import { transformMenuItems } from '../OverflowCommandBar';

interface ActionCellProps {
  onOpen: () => void;
  mutableState: MutableState<MenuItemCommandState[][]>;
}

export function ActionCell({ onOpen, mutableState }: ActionCellProps) {
  const transformedCommands = useMutableStateSelector(
    mutableState,
    (state) => state
  ) as ArrayGroupWithAtLeastOne<MenuItemCommandState>;

  return (
    <TableCellAction
      onOpen={onOpen}
      items={
        transformedCommands.map((item) =>
          transformMenuItems(item, 'en')
        ) as ArrayGroupWithAtLeastOne<MenuItemProps>
      }
    />
  );
}
