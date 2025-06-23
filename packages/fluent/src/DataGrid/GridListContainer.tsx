import {
  Divider,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { ScrollbarWithMoreDataRequest } from '@headless-adminapp/app/components/ScrollbarWithMoreDataRequest';
import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useDataGridSchema,
  useGridData,
  useGridDataState,
  useSelectedView,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useCallback, useMemo, useRef } from 'react';
import { v4 as uuid } from 'uuid';

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
  const styles = useStyles();
  const data = useGridData();
  const dataState = useGridDataState();
  const fetchNextPage = useContextSelector(
    GridContext,
    (state) => state.fetchNextPage
  );
  const schema = useDataGridSchema();
  const view = useSelectedView();

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
    (id: string) => {
      openFormInternal({
        logicalName: schema.logicalName,
        id,
        recordSetIds:
          dataRef.current?.records.map(
            (x) => x[schema.idAttribute] as string
          ) ?? [],
      });
    },
    [openFormInternal, schema.idAttribute, schema.logicalName]
  );

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
                    <div
                      className={mergeClasses(styles.root)}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                        borderRadius: tokens.borderRadiusMedium,
                      }}
                      onClick={() => {
                        const id = row[schema.idAttribute] as string;
                        openRecord(id);
                      }}
                    >
                      <RecordCard
                        cardView={view.experience.card}
                        record={row}
                        schema={schema}
                        selected={false}
                      />
                    </div>
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
      </ScrollbarWithMoreDataRequest>
    </div>
  );
};
