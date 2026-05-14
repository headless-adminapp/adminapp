import { tokens } from '@fluentui/react-components';
import type { BoardColumnCardPreviewFC } from '@headless-adminapp/app/board/types';
import type { Schema } from '@headless-adminapp/core/schema';
import { useCallback } from 'react';

import { useDndContext } from '../components/DndProvider';
import { extendedTokens } from '../components/fluent';

interface BoardColumnCardProps {
  record: Record<string, unknown>;
  index: number;
  canDrag: boolean;
  columnId: string;
  PreviewComponent: BoardColumnCardPreviewFC;
  schema: Schema;
}

export function BoardColumnCard({
  record,
  canDrag,
  columnId,
  PreviewComponent,
  schema,
}: Readonly<BoardColumnCardProps>) {
  const { useDrag } = useDndContext();
  const [{ isDragging }, drag] = useDrag({
    type: columnId,
    canDrag,
    item: () => {
      return { id: record[schema.idAttribute] as string, columnId, record };
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
