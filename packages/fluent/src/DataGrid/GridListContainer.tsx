import {
  Divider,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { CommandItemState } from '@headless-adminapp/app/command';
import { ScrollbarWithMoreDataRequest } from '@headless-adminapp/app/components/ScrollbarWithMoreDataRequest';
import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useDataGridSchema,
  useGridData,
  useGridDataState,
  useGridSelection,
  useMainGridContextCommands,
  useSelectedView,
  useSubGridContextCommands,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLongPress } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import { CardView } from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { extendedTokens } from '../components/fluent';
import { BottomDrawerMenu } from '../Header/MobileHeaderCommandContainer';
import { RecordCard } from '../PageEntityForm/RecordCard';
import { RecordCardLoading } from '../PageEntityForm/RecordCardLoading';
import { UniqueRecord } from './types';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      background: tokens.colorNeutralBackground1Hover,
    },
  },
});

const fallbackData: UniqueRecord[] = [];

interface GridListContainerProps {
  disableSelection?: boolean;
  disableContextMenu?: boolean;
  disableColumnResize?: boolean;
  disableColumnSort?: boolean;
  disableColumnReorder?: boolean;
  disableColumnFilter?: boolean;
  noPadding?: boolean;
}

export const GridListContainer: FC<GridListContainerProps> = () => {
  const data = useGridData();
  const dataState = useGridDataState();
  const fetchNextPage = useContextSelector(
    GridContext,
    (state) => state.fetchNextPage,
  );
  const schema = useDataGridSchema();
  const view = useSelectedView();
  const [showContextMenu, setShowContextMenu] = useState(false);

  const [selectedIds, setSelectedIds] = useGridSelection();

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const { direction } = useLocale();

  const dataRef = useRef(data);
  dataRef.current = data;

  const uniqueRecords = useMemo(() => {
    return (data?.records.map((record) => ({
      ...record,
      __uuid: uuid(),
    })) ?? fallbackData) as UniqueRecord[];
  }, [data?.records]);

  const rows = uniqueRecords;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      tableWrapperRef.current?.parentElement?.parentElement!,
    estimateSize: () => 40,
    overscan: 5,
    enabled: true,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const virtualSize = virtualizer.getTotalSize();

  const openFormInternal = useOpenForm();

  const openRecord = useCallback(
    async (id: string) => {
      const record = dataRef.current?.records.find(
        (r) => r[schema.idAttribute] === id,
      );

      if (!record) {
        return;
      }

      await openFormInternal({
        logicalName: record.$entity || schema.logicalName,
        id,
        recordSetIds:
          dataRef.current?.records.map(
            (x) => x[schema.idAttribute] as string,
          ) ?? [],
      });
    },
    [openFormInternal, schema.idAttribute, schema.logicalName],
  );

  const isSubgrid = useContextSelector(GridContext, (state) => state.isSubGrid);

  const contextCommands = isSubgrid
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSubGridContextCommands()
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useMainGridContextCommands();

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <ScrollbarWithMoreDataRequest
        data={data?.records}
        hasMore={dataState?.hasNextPage}
        rtl={direction === 'rtl'}
        onRequestMore={() => {
          fetchNextPage();
        }}
      >
        <div
          style={{
            position: 'relative',
          }}
          ref={tableWrapperRef}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: virtualizer.getTotalSize(),
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.key}
                    ref={virtualizer.measureElement}
                    data-index={virtualRow.index}
                    style={{
                      width: '100%',
                      position: 'absolute',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {virtualRow.index > 0 && (
                      <div style={{ paddingBlock: 0 }}>
                        <Divider style={{ opacity: 0.2 }} />
                      </div>
                    )}
                    <Item
                      card={view.experience.card}
                      record={row}
                      schema={schema}
                      onClick={async () => {
                        const id = row[schema.idAttribute] as string;
                        await openRecord(id);
                      }}
                      onLongPress={() => {
                        const id = row[schema.idAttribute] as string;
                        setSelectedIds([id]);
                        setShowContextMenu(true);
                      }}
                      selected={selectedIds.includes(
                        row[schema.idAttribute] as string,
                      )}
                    />
                  </div>
                );
              })}
            </div>
            {dataState.isFetching && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  position: 'absolute',
                  transform: `translateY(${virtualSize}px)`,
                }}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <RecordCardLoading
                    key={index}
                    cardView={view.experience.card}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
        <BottomDrawerMenu
          open={showContextMenu}
          onClose={() => {
            setShowContextMenu(false);
            setSelectedIds([]);
          }}
          actions={contextCommands as CommandItemState[][]}
        />
      </ScrollbarWithMoreDataRequest>
    </div>
  );
};

interface ItemProps {
  card: CardView<SchemaAttributes>;
  onClick?: () => void;
  onLongPress?: () => void;
  record: UniqueRecord;
  schema: Schema<SchemaAttributes>;
  selected?: boolean;
}

const Item: FC<ItemProps> = ({
  onClick,
  onLongPress,
  card,
  record,
  schema,
  selected,
}) => {
  const styles = useStyles();
  const isLongPress = useRef(false);

  const onLongPressInternal = () => {
    onLongPress?.();
    isLongPress.current = true;
  };

  const longPressEvent = useLongPress(onLongPressInternal, {
    isPreventDefault: false,
    delay: 500,
  });

  return (
    <div
      className={mergeClasses(styles.root)}
      style={{
        width: '100%',
        cursor: 'pointer',
        borderRadius: extendedTokens.paperBorderRadius,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      {...longPressEvent}
      onClick={onClick}
    >
      <RecordCard
        cardView={card}
        record={record}
        schema={schema}
        selected={selected}
      />
    </div>
  );
};
