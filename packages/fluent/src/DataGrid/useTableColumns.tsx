import {
  makeStyles,
  mergeClasses,
  TableHeaderCell,
  TableSelectionCell,
  tokens,
} from '@fluentui/react-components';
import { GridContext } from '@headless-adminapp/app/datagrid';
import {
  useDataGridSchema,
  useGridColumns,
  useGridData,
  useGridSelection,
  useGridSorting,
  useMainGridContextCommands,
  useSubGridContextCommands,
} from '@headless-adminapp/app/datagrid/hooks';
import { useOpenRecord } from '@headless-adminapp/app/datagrid/hooks/useOpenRecord';
import { useElementSize } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import {
  useContextSelector,
  useMutableState,
} from '@headless-adminapp/app/mutable';
import { useRecordSetSetter } from '@headless-adminapp/app/recordset/hooks';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import {
  calculateColumnWidths,
  getAttributeFormattedValue,
} from '@headless-adminapp/app/utils';
import {
  Attribute,
  DataLookup,
  Id,
  LookupAttribute,
} from '@headless-adminapp/core/attributes';
import { FileObject } from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { PageType } from '@headless-adminapp/core/experience/app';
import { ViewColumn } from '@headless-adminapp/core/experience/view';
import { Schema } from '@headless-adminapp/core/schema';
import { createColumnHelper } from '@tanstack/react-table';
import { FC, useEffect, useMemo, useRef } from 'react';

import { componentStore } from '../componentStore';
import { TableHeaderFilterCell } from '../DataGrid/GridColumnHeader';
import { TableCellText } from '../DataGrid/TableCell';
import { TableCellLink } from '../DataGrid/TableCell/TableCellLink';
import { ActionCell } from './ActionCell';
import { TableCellChoice } from './TableCell/TableCellChoice';
import { UniqueRecord } from './types';

const columnHelper = createColumnHelper<UniqueRecord>();

const useStyles = makeStyles({
  selectionCell: {
    position: 'sticky',
    left: 0,
    background: tokens.colorNeutralBackground1,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
  },
});

export function useTableColumns({
  disableSelection,
  disableContextMenu,
  disableColumnResize,
  disableColumnFilter,
  disableColumnSort,
  tableWrapperRef,
}: {
  disableSelection?: boolean;
  disableContextMenu?: boolean;
  disableColumnResize?: boolean;
  disableColumnFilter?: boolean;
  disableColumnSort?: boolean;
  tableWrapperRef: React.RefObject<HTMLDivElement>;
}) {
  const styles = useStyles();
  const data = useGridData();
  const columns = useGridColumns();
  const [, setSorting] = useGridSorting();
  const schema = useDataGridSchema();
  const { schemaStore } = useMetadata();
  const [selectedIds, setSelectedIds] = useGridSelection();

  const setSelectedIdsRef = useRef(setSelectedIds);
  setSelectedIdsRef.current = setSelectedIds;

  const isSubgrid = useContextSelector(GridContext, (state) => state.isSubGrid);

  const contextCommands = isSubgrid
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSubGridContextCommands()
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useMainGridContextCommands();

  const mutableContextCommandState = useMutableState(contextCommands, true);

  useEffect(() => {
    mutableContextCommandState.setValue(contextCommands);
  }, [contextCommands, mutableContextCommandState]);

  const tableWrapperSize = useElementSize(tableWrapperRef, 100);

  const columnWidths = useMemo(() => {
    const availableWidth = Math.max(
      0,
      (tableWrapperSize.width ?? 0) - 32 - 32 - 16
    );

    const { columns: calculatedColumns } = calculateColumnWidths({
      availableWidth,
      gapWidth: 0,
      columns: columns.map((column) => ({
        width: column.width ?? 100,
        maxWidth: column.maxWidth ?? 1000,
      })),
    });

    return calculatedColumns;
  }, [columns, tableWrapperSize.width]);

  const gridColumns = useGridColumns();

  const routeResolver = useRouteResolver();
  const router = useRouter();
  const recordSetSetter = useRecordSetSetter();

  const openRecord = useOpenRecord();

  const { currency, dateFormats, timezone, timeFormats } = useLocale();

  const dataRef = useRef(data);
  dataRef.current = data;

  const headingSelectionState = useMemo(() => {
    if (data?.records.length === 0) {
      return false;
    }

    if (selectedIds.length === 0) {
      return false;
    }

    if (selectedIds.length === dataRef.current?.records.length) {
      return true;
    }

    return 'mixed';
  }, [data?.records.length, selectedIds]);

  const actionColumns = useMemo(() => {
    if (disableContextMenu) return [];

    return [
      columnHelper.accessor((info) => info[schema.idAttribute], {
        id: '$actionColumn',
        header: () => (
          <TableHeaderCell
            style={{
              minWidth: 32,
              flexShrink: 0,
              // width: 32,
              flex: 1,
              position: 'sticky',
              display: 'flex',
              right: 0,
              top: 0,
              // zIndex: 1,
              background: tokens.colorNeutralBackground1,
              borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
            }}
          >
            &nbsp;
          </TableHeaderCell>
        ),
        cell: (info) => (
          <ActionCell
            onOpen={() => {
              const id = info.row.original[schema.idAttribute] as string;
              setSelectedIdsRef.current([id]);
            }}
            mutableState={mutableContextCommandState as any}
          />
        ),
        enableResizing: false,
        size: 32,
        minSize: 32,
        maxSize: 32,
      }),
    ];
  }, [disableContextMenu, mutableContextCommandState, schema.idAttribute]);

  const selectionColumns = useMemo(() => {
    if (disableSelection) return [];

    return [
      columnHelper.accessor((info) => info[schema.idAttribute], {
        id: '$selectColumn',
        header: () => (
          <TableSelectionCell
            checked={headingSelectionState}
            as={'th' as any}
            style={{
              position: 'sticky',
              display: 'flex',
              left: 0,
              top: 0,
              background: tokens.colorNeutralBackground1,
              zIndex: 1,
              width: 32,
              maxWidth: 32,
              minWidth: 32,
            }}
            onClick={() => {
              setSelectedIdsRef.current((ids) => {
                if (ids.length === dataRef.current?.records.length) {
                  return [];
                }

                return (
                  dataRef.current?.records.map(
                    (record) => record[schema.idAttribute] as string
                  ) ?? []
                );
              });
            }}
          />
        ),
        cell: (info) => (
          <TableSelectionCell
            className={mergeClasses(styles.selectionCell)}
            checked={info.row.getIsSelected()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setSelectedIdsRef.current((ids) => {
                const id = info.row.original[schema.idAttribute] as string;
                if (ids.includes(id)) {
                  return ids.filter((i) => i !== id);
                }

                return [...ids, id];
              });
            }}
            style={{
              width: 32,
              maxWidth: 32,
              minWidth: 32,
            }}
          />
        ),
        enableResizing: false,
        size: 32,
        minSize: 32,
        maxSize: 32,
      }),
    ];
  }, [
    disableSelection,
    headingSelectionState,
    schema.idAttribute,
    styles.selectionCell,
  ]);

  const restColumns = useMemo(() => {
    return gridColumns.map((column, index) => {
      return columnHelper.accessor((info) => info[column.name], {
        id: column.id,
        header: (props) => {
          return (
            <TableHeaderFilterCell
              key={column.id}
              columnName={column.name}
              sortDirection={props.column.getIsSorted() || undefined}
              minWidth={props.header.getSize()}
              column={column}
              resizable={!disableColumnResize}
              disableFilter={disableColumnFilter}
              disableSort={disableColumnSort}
              onChangeSortDirection={(direction) => {
                setSorting([
                  {
                    field: column.name,
                    order: direction,
                  },
                ]);
              }}
              attribute={schema.attributes[column.name]}
              onResetSize={props.column.resetSize}
              resizeHandler={props.header.getResizeHandler()}
            >
              {column.label}
            </TableHeaderFilterCell>
          );
        },
        cell: (info) => {
          let attribute: Attribute | undefined;
          let value: unknown;
          if (column.expandedKey) {
            const lookup = column.name;
            const field = column.expandedKey;
            const entity = (schema.attributes[lookup] as LookupAttribute)
              .entity;
            const lookupSchema = schemaStore.getSchema(entity);
            attribute = lookupSchema.attributes[field];
            value = info.row.original.$expand?.[lookup]?.[field];
          } else {
            attribute = schema.attributes[column.name];
            value = info.getValue();
          }

          const formattedValue =
            getAttributeFormattedValue(attribute, value, {
              currency: currency.currency,
              dateFormat: dateFormats.short,
              timeFormat: timeFormats.short,
              timezone,
            }) ?? '';

          if (column.plainText) {
            return (
              <TableCellText
                key={column.id}
                value={formattedValue}
                width={info.column.getSize()}
              />
            );
          }

          if (column.component) {
            const Component = componentStore.getComponent<
              FC<{
                column: ViewColumn;
                schema: Schema;
                record: UniqueRecord;
                value: unknown;
                attribute: Attribute;
                formattedValue: string;
                width: number;
              }>
            >(column.component);

            if (!Component) {
              throw new Error(
                `Component with name ${column.component} not found`
              );
            }

            return (
              <Component
                column={column}
                schema={schema}
                record={info.row.original}
                value={value}
                attribute={attribute}
                formattedValue={formattedValue}
                width={info.column.getSize()}
              />
            );
          }

          if (schema.primaryAttribute === column.name) {
            const path = routeResolver({
              logicalName: schema.logicalName,
              type: PageType.EntityForm,
              id: info.row.original[schema.idAttribute] as string,
            });

            return (
              <TableCellLink
                key={column.id}
                value={value as string}
                width={info.column.getSize()}
                href={path}
                onClick={() => {
                  openRecord(info.row.original[schema.idAttribute] as string);
                }}
              />
            );
          }

          switch (attribute?.type) {
            case 'money':
              return (
                <TableCellText
                  key={column.id}
                  value={formattedValue}
                  width={info.column.getSize()}
                  textAlignment="right"
                />
              );
            case 'lookup':
              if (!value) {
                return (
                  <TableCellText
                    key={column.id}
                    value=""
                    width={info.column.getSize()}
                  />
                );
              }
              const path = routeResolver({
                logicalName: attribute.entity,
                type: PageType.EntityForm,
                id: (value as unknown as DataLookup<Id>).id as string,
              });

              return (
                <TableCellLink
                  key={column.id}
                  value={formattedValue}
                  width={info.column.getSize()}
                  href={path}
                  onClick={() => {
                    recordSetSetter('', []);
                    router.push(path);
                  }}
                />
              );
            case 'attachment':
              const url = (value as unknown as FileObject)?.url;
              if (!url) {
                return (
                  <TableCellText
                    key={column.id}
                    value=""
                    width={info.column.getSize()}
                  />
                );
              }

              return (
                <TableCellLink
                  key={column.id}
                  value={formattedValue}
                  width={info.column.getSize()}
                  href={url}
                  target="_blank"
                />
              );
            case 'choice':
              return (
                <TableCellChoice
                  column={column}
                  schema={schema}
                  record={info.row.original}
                  value={value}
                  attribute={attribute}
                  formattedValue={formattedValue}
                  width={info.column.getSize()}
                />
              );
          }

          return (
            <TableCellText
              key={column.id}
              value={formattedValue}
              width={info.column.getSize()}
            />
          );
        },
        enableResizing: true,
        size: columnWidths[index],
        minSize: 100,
        maxSize: 1000,
      });
    });
  }, [
    columnWidths,
    currency.currency,
    dateFormats.short,
    timeFormats.short,
    disableColumnFilter,
    disableColumnResize,
    disableColumnSort,
    gridColumns,
    openRecord,
    recordSetSetter,
    routeResolver,
    router,
    schema,
    schemaStore,
    setSorting,
    timezone,
  ]);

  return useMemo(() => {
    return [...selectionColumns, ...restColumns, ...actionColumns];
  }, [selectionColumns, restColumns, actionColumns]);
}
