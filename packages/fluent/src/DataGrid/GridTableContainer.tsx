import {
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
import { useRecordSetSetter } from '@headless-adminapp/app/recordset/hooks';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import { PageType } from '@headless-adminapp/core/experience/app';
import {
  InferredSchemaType,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Data } from '@headless-adminapp/core/transport';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ScrollbarWithMoreDataRequest } from './ScrollbarWithMoreDataRequest';
import { useTableColumns } from './useTableColumns';
import { adjustTableHeight } from './utils';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      // background: tokens.colorNeutralForeground1Hover,
      '& .fui-TableSelectionCell': {
        background: 'inherit',
      },
      '& .tableCellAction': {
        background: 'inherit !important',
      },
    },

    '& .tableCellAction': {
      background: tokens.colorNeutralBackground1,
    },

    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,

    '& .fui-TableCell': {
      // borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
      // borderBottom: 'none !important',
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
    color: 'yellow',

    '&:after': {
      content: ' ',
      display: 'block',
      height: '32px',
    },
  },
});

const fallbackData: Data<InferredSchemaType<SchemaAttributes>>[] = [];

interface GridTableContainerProps {
  disableSelection?: boolean;
  disableContextMenu?: boolean;
  disableColumnResize?: boolean;
  disableColumnSort?: boolean;
  disableColumnReorder?: boolean;
  disableColumnFilter?: boolean;
  noPadding?: boolean;
}

export const GridTableContainer: FC<GridTableContainerProps> = ({
  noPadding,
  disableColumnFilter,
  disableColumnSort,
  disableColumnResize,
  disableContextMenu,
  disableSelection,
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

  const sortingState = useMemo(() => {
    return sorting.map((sort) => ({
      id: sort.field,
      desc: sort.order === 'desc',
    }));
  }, [sorting]);

  const tableWrapperRef = useRef<HTMLDivElement>(null);

  const routeResolver = useRouteResolver();
  const router = useRouter();
  const recordSetSetter = useRecordSetSetter();

  const openRecord = useCallback(
    (id: string) => {
      const path = routeResolver({
        logicalName: schema.logicalName,
        type: PageType.EntityForm,
        id,
      });

      recordSetSetter(
        schema.logicalName,
        dataRef.current?.records.map((x) => x[schema.idAttribute] as string) ??
          []
      );
      router.push(path);
    },
    [
      recordSetSetter,
      routeResolver,
      router,
      schema.idAttribute,
      schema.logicalName,
    ]
  );

  const { direction } = useLocale();

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

  const rowSelection = useMemo(() => {
    return selectedIds.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {} as any);
  }, [selectedIds]);

  const table = useReactTable({
    data: data?.records ?? fallbackData,
    columns: tableColumns,
    getRowId: (row) => row[schema.idAttribute] as string,
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
    estimateSize: () => 44,
    overscan: 30,
    paddingStart: 33,
  });

  const tableElementRef = useRef<HTMLTableElement>(null);

  const virtualItems = virtualizer.getVirtualItems();
  const virtualSize = virtualizer.getTotalSize();

  const [isScrollNearBottom, setIsScrollNearBottom] = useState(false);

  // callback to adjust the height of the pseudo element
  const handlePseudoResize = useCallback(() => {
    return adjustTableHeight(tableElementRef, virtualSize);
  }, [virtualSize]);

  // callback to handle scrolling, checking if we are near the bottom
  const handleScroll = useCallback(() => {
    if (tableWrapperRef.current?.parentElement?.parentElement) {
      const scrollPosition =
        tableWrapperRef.current?.parentElement?.parentElement?.scrollTop;
      const visibleHeight =
        tableWrapperRef.current?.parentElement?.parentElement?.clientHeight;
      setIsScrollNearBottom(
        scrollPosition > virtualSize * 0.95 - visibleHeight
      );
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
            paddingInline: noPadding ? 0 : 8,
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
              height: virtualizer.getTotalSize() + 33,
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
                background: tokens.colorNeutralBackground3,
                zIndex: 2,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  style={{
                    position: 'sticky',
                    top: 0,
                    display: 'flex',
                    minWidth: 'calc(100% - 16px)',
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
                transform: 'translateY(-33px)',
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];

                return (
                  <TableRow
                    key={row.id}
                    className={mergeClasses(styles.root)}
                    style={{
                      display: 'flex',
                      height: `${virtualRow.size}px`,
                      minWidth: 'calc(100% - 16px)',
                      position: 'absolute',
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
                      height: 44,
                      alignItems: 'center',
                    }}
                  >
                    {table.getAllColumns().map((column, index) => {
                      if (!column.getIsVisible()) return null;
                      return (
                        <TableCell
                          key={index}
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
      </ScrollbarWithMoreDataRequest>
    </div>
  );
};