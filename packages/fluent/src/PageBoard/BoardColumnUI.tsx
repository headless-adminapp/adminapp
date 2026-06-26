import {
  Body1,
  Body1Strong,
  CounterBadge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { BoardColumnContext } from '@headless-adminapp/app/board/context';
import {
  useBoardColumnConfig,
  useBoardColumnData,
  useBoardColumnDataState,
  useBoardConfig,
} from '@headless-adminapp/app/board/hooks';
import { ScrollbarWithMoreDataRequest } from '@headless-adminapp/app/components/ScrollbarWithMoreDataRequest';
import { useContextSelector } from '@headless-adminapp/app/mutable/context';
import { Icons } from '@headless-adminapp/icons';
import { type FC } from 'react';

import { extendedTokens } from '../components/fluent';
import { BoardColumnCard } from './BoardColumnCard';
import { BoardingColumnCardLoading } from './BoardingColumnCardLoading';
import { LaneDropArea } from './LaneDropArea';

const useStyles = makeStyles({
  lanesContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    paddingInline: tokens.spacingHorizontalS,
    paddingBlock: tokens.spacingVerticalXXS,

    // first child border radius
    '& > :first-child': {
      borderTopLeftRadius: extendedTokens.paperBorderRadius,
      borderTopRightRadius: extendedTokens.paperBorderRadius,
    },
    // last child border radius
    '& > :last-child': {
      borderBottomLeftRadius: extendedTokens.paperBorderRadius,
      borderBottomRightRadius: extendedTokens.paperBorderRadius,
    },
  },
});

export const BoardColumnUI: FC = () => {
  const data = useBoardColumnData();
  const dataState = useBoardColumnDataState();
  const fetchNextPage = useContextSelector(
    BoardColumnContext,
    (state) => state.fetchNextPage,
  );

  const { columnId, lanes, laneResolver } = useBoardColumnConfig();

  const {
    PreviewComponent,
    HeaderComponent = ColumnHeaderComponent,
    emptyMessage = 'Nothing to show here. Drag and drop items from other columns.',
    schema,
    minColumnWidth,
    maxColumnWidth,
    transition,
  } = useBoardConfig();

  const isEmpty = !data?.records.length && !dataState.isFetching;

  const styles = useStyles();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingTop: tokens.spacingVerticalS,
        minWidth: minColumnWidth ?? 240,
        maxWidth: maxColumnWidth ?? 400,
        position: 'relative',
      }}
    >
      <HeaderComponent />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          position: 'relative',
        }}
      >
        {isEmpty && (
          <div
            style={{
              padding: tokens.spacingHorizontalS,
              display: 'flex',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: tokens.spacingVerticalM,
                color: tokens.colorNeutralForeground3,
                padding: tokens.spacingVerticalXXXL,
                borderRadius: extendedTokens.paperBorderRadius,
                backgroundColor: tokens.colorNeutralBackground1,
              }}
            >
              <Icons.Search size={56} opacity={0.8} />
              <Body1 style={{ textAlign: 'center' }}>{emptyMessage}</Body1>
            </div>
          </div>
        )}
        {!isEmpty && (
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
                  PreviewComponent={PreviewComponent}
                  schema={schema}
                  laneId={laneResolver(record)}
                  transition={transition}
                />
              ))}
              {dataState.isFetching &&
                Array.from({ length: 5 }).map((_, index) => (
                  <BoardingColumnCardLoading key={index} />
                ))}
            </div>
          </ScrollbarWithMoreDataRequest>
        )}
        <div className={styles.lanesContainer}>
          {lanes.map((laneConfig) => (
            <LaneDropArea
              key={laneConfig.id}
              columnId={columnId}
              laneConfig={laneConfig}
              transition={transition}
              schema={schema}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ColumnHeaderComponent: FC = () => {
  const data = useBoardColumnData();
  const { title } = useBoardColumnConfig();

  return (
    <div
      style={{
        display: 'flex',
        paddingInline: tokens.spacingHorizontalS,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: tokens.spacingHorizontalS,
        }}
      >
        <Body1Strong>{title}</Body1Strong>
        {!!data?.count && (
          <CounterBadge color="informative">{data?.count}</CounterBadge>
        )}
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
};
