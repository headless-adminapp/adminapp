import { tokens } from '@fluentui/react-components';
import type { ColumnLaneTransition } from '@headless-adminapp/app/board/ColumnLaneTransition';
import type {
  BoardColumnCardPreviewFC,
  DragItem,
} from '@headless-adminapp/app/board/types';
import type { Schema } from '@headless-adminapp/core/schema';
import { getRecordId } from '@headless-adminapp/core/transport/utils';
import { useCallback, useMemo } from 'react';

import { useDndContext } from '../components/DndProvider';
import { extendedTokens } from '../components/fluent';

interface BoardColumnCardProps {
  record: Record<string, unknown>;
  index: number;
  columnId: string;
  laneId: string;
  PreviewComponent: BoardColumnCardPreviewFC;
  schema: Schema;
  transition: ColumnLaneTransition;
}

export function BoardColumnCard({
  record,
  columnId,
  PreviewComponent,
  schema,
  laneId,
  transition,
}: Readonly<BoardColumnCardProps>) {
  const canDrag = useMemo(
    () => transition.getReceivingLanes(columnId, laneId).length > 0,
    [columnId, laneId, transition],
  );
  const { useDrag } = useDndContext();
  const [{ isDragging }, drag] = useDrag({
    type: `${columnId}::${laneId}`,
    canDrag,
    item: () => {
      return {
        id: getRecordId(schema, record),
        columnId,
        laneId,
        record,
      } as DragItem;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drag(node);
      }
    },
    [drag],
  );

  return (
    <div
      ref={dragRef}
      style={{
        display: 'flex',
        background: tokens.colorNeutralBackground1,
        borderRadius: extendedTokens.paperBorderRadius,
        boxShadow: tokens.shadow4,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <PreviewComponent record={record} />
    </div>
  );
}
