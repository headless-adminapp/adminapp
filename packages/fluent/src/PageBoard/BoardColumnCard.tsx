import { tokens } from '@fluentui/react-components';
import { BoardColumnCardPreviewFC } from '@headless-adminapp/app/board/types';
import { Schema } from '@headless-adminapp/core/schema';
import { useRef } from 'react';

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
  const ref = useRef<HTMLDivElement>(null);
  const { useDrag } = useDndContext();
  const [{ isDragging }, drag] = useDrag({
    type: columnId,
    canDrag,
    item: () => {
      return { id: record[schema.idAttribute] as string, columnId, record };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  return (
    <div
      ref={ref}
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
