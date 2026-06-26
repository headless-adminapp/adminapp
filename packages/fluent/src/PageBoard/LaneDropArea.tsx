import { Body1Strong, tokens } from '@fluentui/react-components';
import type { ColumnLaneTransition } from '@headless-adminapp/app/board/ColumnLaneTransition';
import type {
  BoardColumnLaneConfig,
  DragItem,
} from '@headless-adminapp/app/board/types';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import type { Schema } from '@headless-adminapp/core/schema';
import type { Identifier } from 'dnd-core';
import { type FC, useCallback, useMemo } from 'react';

import { useDndContext } from '../components/DndProvider';

interface LaneDropAreaProps {
  columnId: string;
  laneConfig: BoardColumnLaneConfig;
  transition: ColumnLaneTransition;
  schema: Schema;
}

export const LaneDropArea: FC<LaneDropAreaProps> = ({
  columnId,
  laneConfig,
  transition,
  schema,
}) => {
  const baseContext = useBaseCommandHandlerContext();
  const { useDrop } = useDndContext();

  const acceptSourceIds = useMemo(() => {
    return transition.getSendingLaneIds(columnId, laneConfig.id);
  }, [columnId, laneConfig.id, transition]);

  const [{ handlerId, over, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; over: boolean; canDrop: boolean }
  >({
    accept: acceptSourceIds,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        over: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    drop: (item) => {
      (async () => {
        await laneConfig.updateFn?.({
          ...baseContext,
          primaryControl: {
            logicalName: schema.logicalName,
            id: item.id,
            schema: schema as unknown as Schema,
            record: item.record,
          },
          lane: {
            columnId,
            laneId: laneConfig.id,
          },
        });
      })().catch(console.error);
    },
  });

  const dropRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        drop(node);
      }
    },
    [drop],
  );

  return (
    <div
      ref={dropRef}
      style={{
        display: 'flex',
        flex: 1,
        pointerEvents: over || canDrop ? 'auto' : 'none',
        outline: over
          ? `2px dashed ${tokens.colorBrandBackground}`
          : canDrop
            ? `2px dashed ${tokens.colorNeutralStroke1}`
            : 'none',
        outlineOffset: -1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: canDrop
          ? tokens.colorNeutralBackgroundAlpha2
          : 'transparent',
      }}
      data-handler-id={handlerId}
    >
      {canDrop && (
        <Body1Strong style={{ color: tokens.colorNeutralForeground2 }}>
          {laneConfig.title}
        </Body1Strong>
      )}
    </div>
  );
};
