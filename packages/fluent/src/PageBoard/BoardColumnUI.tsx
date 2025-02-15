import { Body1Strong, tokens } from '@fluentui/react-components';
import { BoardColumnContext } from '@headless-adminapp/app/board/context';
import {
  useBoardColumnConfig,
  useBoardColumnData,
  useBoardColumnDataState,
  useBoardConfig,
} from '@headless-adminapp/app/board/hooks';
import { DragItem } from '@headless-adminapp/app/board/types';
import { useBaseCommandHandlerContext } from '@headless-adminapp/app/command/hooks';
import { ScrollbarWithMoreDataRequest } from '@headless-adminapp/app/components/ScrollbarWithMoreDataRequest';
import { useContextSelector } from '@headless-adminapp/app/mutable/context';
import { Schema } from '@headless-adminapp/core/schema';
import type { Identifier } from 'dnd-core';
import { FC, useMemo, useRef } from 'react';

import { useDndContext } from '../components/DndProvider';
import { BoardColumnCard } from './BoardColumnCard';
import { BoardingColumnCardLoading } from './BoardingColumnCardLoading';

export const BoardColumnUI: FC = () => {
  const data = useBoardColumnData();
  const dataState = useBoardColumnDataState();
  const fetchNextPage = useContextSelector(
    BoardColumnContext,
    (state) => state.fetchNextPage
  );

  const { columnId, acceptSourceIds, title, updateFn } = useBoardColumnConfig();

  const { PreviewComponent, schema, columnConfigs } = useBoardConfig();

  const baseContext = useBaseCommandHandlerContext();
  const { useDrop } = useDndContext();

  const ref = useRef<HTMLDivElement>(null);
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
        await updateFn?.({
          ...baseContext,
          primaryControl: {
            logicalName: schema.logicalName,
            id: item.id,
            schema: schema as unknown as Schema,
          },
        });
      })().catch(console.error);
    },
  });

  const canDrag = useMemo(() => {
    return columnConfigs.some((config) => config.acceptSourceIds.length > 0);
  }, [columnConfigs]);

  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderRadius: tokens.borderRadiusXLarge,
        outline: over
          ? `2px dashed ${tokens.colorBrandBackground}`
          : canDrop
          ? `2px dashed ${tokens.colorNeutralStroke1}`
          : 'none',
        outlineOffset: -5,
        paddingTop: tokens.spacingVerticalS,
      }}
      data-handler-id={handlerId}
    >
      <div
        style={{
          display: 'flex',
          paddingInline: tokens.spacingHorizontalS,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Body1Strong>{title}</Body1Strong>
          <div style={{ flex: 1 }} />
        </div>
      </div>
      <ScrollbarWithMoreDataRequest
        data={data?.records}
        hasMore={dataState?.hasNextPage}
        onRequestMore={() => {
          fetchNextPage();
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacingHorizontalM,
            padding: tokens.spacingHorizontalS,
          }}
        >
          {data?.records.map((record, index) => (
            <BoardColumnCard
              key={index}
              record={record}
              index={index}
              columnId={columnId}
              canDrag={canDrag}
              PreviewComponent={PreviewComponent}
              schema={schema}
            />
          ))}
          {dataState.isFetching &&
            Array.from({ length: 5 }).map((_, index) => (
              <BoardingColumnCardLoading key={index} />
            ))}
        </div>
      </ScrollbarWithMoreDataRequest>
    </div>
  );
};
