import {
  Body1,
  makeStyles,
  mergeClasses,
  SkeletonItem,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  tokens,
} from '@fluentui/react-components';
import { ScrollbarWithMoreDataRequest } from '@headless-adminapp/app/components/ScrollbarWithMoreDataRequest';
import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useDataGridSchema,
  useGridColumns,
  useGridData,
  useGridDataState,
  useGridSelection,
  useGridSorting,
} from '@headless-adminapp/app/datagrid/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import { Icons } from '@headless-adminapp/icons';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { usePageEntityViewStrings } from '../PageEntityView/PageEntityViewStringContext';
import {
  DEFAULT_TABLE_HEADER_HEIGHT,
  DEFAULT_TABLE_ROW_HEIGHT,
} from './constants';
import { UniqueRecord } from './types';
import { useTableColumns } from './useTableColumns';
import { adjustTableHeight } from './utils';

const useStyles = makeStyles({
  root: {
    '[aria-selected="true"]': {
      background: tokens.colorSubtleBackgroundHover,

      '& .fui-TableSelectionCell': {
        background: 'inherit',
      },

      '& .tableCellAction': {
        background: 'inherit',
        opacity: 1,
      },
    },
    '&:hover': {
      // background: tokens.colorNeutralForeground1Hover,
      '& .fui-TableSelectionCell': {
        background: 'inherit',
      },
      '& .tableCellAction': {
        background: 'inherit !important',
        opacity: 1,

        '& > button': {
          opacity: 1,
        },
      },
    },

    '& .tableCellAction': {
      background: tokens.colorNeutralBackground1,
      opacity: 0,

      '& > button': {
        opacity: 0,

        '[aria-expanded="true"],&:hover': {
          opacity: 1,
        },
      },
    },

    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,

    '& .fui-TableCell': {
      // borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
      // borderBottom: 'none !important',
    },

    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  selectionCell: {
    position: 'sticky',
    left: 0,
    background: tokens.colorNeutralBackground1,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
  },
  table: {
    '&:after': {
      content: ' ',
      display: 'block',
      height: '32px',
    },
  },
});

const fallbackData: UniqueRecord[] = [];

interface GridTableContainerProps {
  disableSelection?: boolean;
  disableContextMenu?: boolean;
  disableColumnResize?: boolean;
  disableColumnSort?: boolean;
  disableColumnFilter?: boolean;
  noPadding?: boolean;
  headerHeight?: number;
  rowHeight?: number;
}

export const GridTableContainer: FC<GridTableContainerProps> = ({
  noPadding,
  disableColumnFilter,
  disableColumnSort,
  disableColumnResize,
  disableContextMenu,
  disableSelection,
  headerHeight = DEFAULT_TABLE_HEADER_HEIGHT,
  rowHeight = DEFAULT_TABLE_ROW_HEIGHT,
}) => {
  const styles = useStyles();
  const data = useGridData();
  const dataState = useGridDataState();
  const fetchNextPage = useContextSelector(
    GridContext,
    (state) => state.fetchNextPage
  );
  const columns = useGridColumns();
  const [sorting] = useGridSorting();
  const schema = useDataGridSchema();
  const [selectedIds, setSelectedIds] = useGridSelection();

  const setSelectedIdsRef = useRef(setSelectedIds);
  setSelectedIdsRef.current = setSelectedIds;

  const [isScrolled, setIsScrolled] = useState(false);

  const sortingState = useMemo(() => {
    return sorting.map((sort) => ({
      id: sort.field,
      desc: sort.order === 'desc',
    }));
  }, [sorting]);

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const openFormInternal = useOpenForm();

  const openRecord = useCallback(
    (id: string) => {
      openFormInternal({
        logicalName: schema.logicalName,
        id,
        recordSetIds: dataRef.current?.records.map(
          (x) => x[schema.idAttribute] as string
        ),
      });
    },
    [openFormInternal, schema.idAttribute, schema.logicalName]
  );

  const { direction } = useLocale();
  const strings = usePageEntityViewStrings();

  const dataRef = useRef(data);
  dataRef.current = data;

  const tableColumns = useTableColumns({
    disableColumnFilter,
    disableColumnResize,
    disableColumnSort,
    disableContextMenu,
    disableSelection,
    tableWrapperRef,
  });

  const uniqueRecords = useMemo(() => {
    return (data?.records.map((record) => ({
      ...record,
      __uuid: uuid(),
    })) ?? fallbackData) as UniqueRecord[];
  }, [data?.records]);

  const idMapping = useMemo(
    () =>
      uniqueRecords.reduce((acc, record) => {
        acc[record[schema.idAttribute] as string] = record.__uuid;
        return acc;
      }, {} as Record<string, string>),
    [uniqueRecords, schema.idAttribute]
  );

  const rowSelection = useMemo(() => {
    return selectedIds.reduce((acc, id) => {
      acc[idMapping[id]] = true;
      return acc;
    }, {} as any);
  }, [selectedIds, idMapping]);

  const table = useReactTable({
    data: uniqueRecords,
    columns: tableColumns,
    getRowId: (row) => row.__uuid,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    onRowSelectionChange: () => {
      // do nothing
    },
    state: {
      rowSelection,
      sorting: sortingState,
    },
  });

  const tableRef = useRef(table);
  tableRef.current = table;

  useEffect(() => {
    tableRef.current.resetColumnSizing();
  }, [columns]);

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      tableWrapperRef.current?.parentElement?.parentElement!,
    estimateSize: () => rowHeight,
    overscan: 30,
    paddingStart: headerHeight,
  });

  const tableElementRef = useRef<HTMLTableElement>(null);

  const virtualItems = virtualizer.getVirtualItems();
  const virtualSize = virtualizer.getTotalSize();

  const [isScrollNearBottom, setIsScrollNearBottom] = useState(false);

  // callback to adjust the height of the pseudo element
  const handlePseudoResize = useCallback(() => {
    return adjustTableHeight(tableElementRef, virtualSize);
  }, [virtualSize]);

  // callback to handle scrolling, checking if we are near the bottom or top
  const handleScroll = useCallback(() => {
    if (tableWrapperRef.current?.parentElement?.parentElement) {
      const scrollPosition =
        tableWrapperRef.current?.parentElement?.parentElement?.scrollTop;
      const visibleHeight =
        tableWrapperRef.current?.parentElement?.parentElement?.clientHeight;
      setIsScrollNearBottom(
        scrollPosition > virtualSize * 0.95 - visibleHeight
      );
      setIsScrolled(scrollPosition > 0);
    }
  }, [virtualSize]);

  // add an event listener on the scrollable parent container and resize the
  // pseudo element whenever the table renders with new data
  useEffect(() => {
    const scrollable = tableWrapperRef.current?.parentElement?.parentElement;
    if (scrollable) scrollable.addEventListener('scroll', handleScroll);
    handlePseudoResize();

    return () => {
      if (scrollable) scrollable.removeEventListener('scroll', handleScroll);
    };
  }, [data, handleScroll, handlePseudoResize]);

  // if we are near the bottom of the table, resize the pseudo element each time
  // the length of virtual items changes (which is effectively the number of table
  // rows rendered to the DOM). This ensures we don't scroll too far or too short.
  useEffect(() => {
    if (isScrollNearBottom) handlePseudoResize();
  }, [isScrollNearBottom, virtualItems.length, handlePseudoResize]);

  const isScrolledToRight =
    tableWrapperRef.current?.parentElement?.parentElement?.scrollLeft ===
    (tableWrapperRef.current?.parentElement?.parentElement?.scrollWidth ?? 0) -
      (tableWrapperRef.current?.parentElement?.parentElement?.clientWidth ?? 0);

  const hPadding = noPadding ? 0 : 8;

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
            paddingInline: hPadding,
            position: 'relative',
          }}
          ref={tableWrapperRef}
        >
          <Table
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderCollapse: 'collapse',
              width: '100%',
              height: virtualizer.getTotalSize() + headerHeight,
              ['--action-shadow' as any]: !isScrolledToRight
                ? '-2px 0px 6px rgba(0, 0, 0, 0.12)'
                : 'none',
            }}
            ref={tableElementRef}
            className="table-pseduo"
          >
            <TableHeader
              style={{
                display: 'flex',
                position: 'sticky',
                top: 0,
                background: tokens.colorNeutralBackground1,
                zIndex: 2,
                boxShadow: isScrolled && noPadding ? tokens.shadow2 : 'none',
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  style={{
                    position: 'sticky',
                    top: 0,
                    display: 'flex',
                    minWidth: 'calc(100%)',
                    borderBottomColor:
                      isScrolled && noPadding
                        ? 'transparent'
                        : tokens.colorNeutralStroke3,
                    borderBottomStyle: 'solid',
                    borderBottomWidth: tokens.strokeWidthThin,
                    height: headerHeight,
                  }}
                >
                  {headerGroup.headers.map((header) =>
                    header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, {
                          ...header.getContext(),
                          key: header.id,
                        })
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody
              style={{
                display: 'flex',
                flexDirection: 'column',
                transform: `translateY(-${headerHeight}px)`,
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];

                return (
                  <TableRow
                    key={row.id}
                    aria-selected={row.getIsSelected()}
                    className={mergeClasses(styles.root)}
                    style={{
                      display: 'flex',
                      height: `${virtualRow.size}px`,
                      minWidth: `calc(100% - ${hPadding * 2}px)`,
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onClick={() => {
                      setSelectedIdsRef.current(() => {
                        const id = row.original[schema.idAttribute] as string;

                        return [id];
                      });
                    }}
                    onDoubleClick={() => {
                      const id = row.original[schema.idAttribute] as string;
                      openRecord(id);
                    }}
                  >
                    {row.getVisibleCells().map((cell) =>
                      flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                        key: cell.column.id,
                      })
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
            {dataState.isFetching && (
              <TableBody
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'absolute',
                  transform: `translateY(${virtualSize}px)`,
                }}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableRow
                    key={index}
                    style={{
                      display: 'flex',
                      height: rowHeight,
                      alignItems: 'center',
                    }}
                  >
                    {table.getAllColumns().map((column) => {
                      if (!column.getIsVisible()) return null;
                      return (
                        <TableCell
                          key={column.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            width: column.getSize(),
                          }}
                        >
                          <SkeletonItem size={16} />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </div>
        {data?.records.length === 0 && !dataState.isFetching && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              inset: 0,
              gap: tokens.spacingVerticalL,
              color: tokens.colorNeutralForeground3,
            }}
          >
            <div>
              <Icons.Search size={64} />
            </div>
            <Body1>{strings.noRecordsFound}</Body1>
          </div>
        )}
      </ScrollbarWithMoreDataRequest>
    </div>
  );
};
