import {
  Body1,
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  tokens,
} from '@fluentui/react-components';
import { TransformedViewColumn } from '@headless-adminapp/app/datagrid';
import { Icons } from '@headless-adminapp/icons';
import type { Identifier, XYCoord } from 'dnd-core';
import { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const ItemTypes = {
  CARD: 'column',
};

interface CardProps {
  item: TransformedViewColumn;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  isFirst: boolean;
  isLast: boolean;
  onRemove: () => void;
  stringSet?: any; // CustomizeColumnStrings;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ColumnItem: FC<CardProps> = ({
  item,
  index,
  moveItem,
  isFirst,
  isLast,
  onRemove,
  stringSet = {}, // defaultCustomizeColumnStrings,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id: item.id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{
        background: tokens.colorNeutralBackground4,
        paddingBlock: tokens.spacingVerticalXS,
        paddingLeft: tokens.spacingHorizontalS,
        cursor: 'move',
        opacity,
        borderRadius: tokens.borderRadiusMedium,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      data-handler-id={handlerId}
    >
      <Body1 style={{ flex: 1 }}>{item.label}</Body1>
      <Menu positioning="below-start">
        <MenuTrigger>
          <Button
            icon={<Icons.MoreVertical />}
            appearance="transparent"
            size="small"
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem icon={<Icons.Delete />} onClick={onRemove}>
              {stringSet.remove}
            </MenuItem>
            {!isFirst && (
              <MenuItem
                icon={<Icons.Add />}
                onClick={() => {
                  moveItem(index, index - 1);
                }}
              >
                {stringSet.moveUp}
              </MenuItem>
            )}
            {!isLast && (
              <MenuItem
                icon={<Icons.Add />}
                onClick={() => {
                  moveItem(index, index + 1);
                }}
              >
                {stringSet.moveDown}
              </MenuItem>
            )}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
