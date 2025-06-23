import {
  Avatar,
  makeStyles,
  mergeClasses,
  TableHeaderCell,
  TableSelectionCell,
  tokens,
} from '@fluentui/react-components';
import {
  GridContext,
  TransformedViewColumn,
} from '@headless-adminapp/app/datagrid';
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
import {
  InternalRouteResolver,
  RouterInstance,
} from '@headless-adminapp/app/route/context';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import {
  calculateColumnWidths,
  getAttributeFormattedValue,
} from '@headless-adminapp/app/utils';
import { parsePhoneNumber } from '@headless-adminapp/app/utils/phone';
import {
  Attribute,
  DataLookup,
  Id,
  LookupAttribute,
} from '@headless-adminapp/core/attributes';
import { FileObject } from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { RegardingAttribute } from '@headless-adminapp/core/attributes/LookupAttribute';
import { PageType } from '@headless-adminapp/core/experience/app';
import { Locale } from '@headless-adminapp/core/experience/locale';
import { ViewColumnProps } from '@headless-adminapp/core/experience/view/ViewColumn';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import {
  CellContext,
  createColumnHelper,
  HeaderContext,
} from '@tanstack/react-table';
import { FC, Fragment, useEffect, useMemo, useRef } from 'react';

import { componentStore } from '../componentStore';
import { TableHeaderFilterCell } from '../DataGrid/GridColumnHeader';
import { TableCellText } from '../DataGrid/TableCell';
import { TableCellLink } from '../DataGrid/TableCell/TableCellLink';
import { getAvatarColor } from '../utils/avatar';
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
      columns: columns.map((column) => {
        const attribute = schema.attributes[column.name];

        let defaultMaxWidth = 1000;

        if (attribute.type === 'date') {
          if (attribute.format === 'datetime') {
            defaultMaxWidth = 200;
          } else {
            defaultMaxWidth = 100;
          }
        } else if (attribute.type === 'money') {
          defaultMaxWidth = 150;
        }

        return {
          width: column.width ?? 100,
          maxWidth: column.maxWidth ?? defaultMaxWidth,
        };
      }),
    });

    return calculatedColumns;
  }, [columns, tableWrapperSize.width, schema.attributes]);

  const gridColumns = useGridColumns();

  const routeResolver = useRouteResolver();
  const router = useRouter();

  const openRecord = useOpenRecord();

  const locale = useLocale();

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
              // borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke3}`,
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

    function getAllIds() {
      return (
        dataRef.current?.records.map(
          (record) => record[schema.idAttribute] as string
        ) ?? []
      );
    }

    function toggleAllSelectedIds() {
      setSelectedIdsRef.current((ids) => {
        if (ids.length === dataRef.current?.records.length) {
          return [];
        }

        return getAllIds();
      });
    }

    function excludeId(ids: string[], id: string) {
      return ids.filter((i) => i !== id);
    }

    function toggleSelectedId(info: CellContext<UniqueRecord, unknown>) {
      setSelectedIdsRef.current((ids) => {
        const id = info.row.original[schema.idAttribute] as string;
        if (ids.includes(id)) {
          return excludeId(ids, id);
        }

        return [...ids, id];
      });
    }

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
              alignItems: 'center',
            }}
            onClick={toggleAllSelectedIds}
          />
        ),
        cell: (info) => (
          <TableSelectionCell
            className={mergeClasses(styles.selectionCell)}
            checked={info.row.getIsSelected()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();

              toggleSelectedId(info);
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
      function onChangeSortDirection(direction: 'asc' | 'desc') {
        setSorting([
          {
            field: column.name,
            order: direction,
          },
        ]);
      }

      return columnHelper.accessor((info) => info[column.name], {
        id: column.id,
        header: (props) => {
          return renderCellHeaderContent({
            props,
            column,
            disableColumnResize,
            disableColumnFilter,
            disableColumnSort,
            onChangeSortDirection,
          });
        },
        cell: (info) =>
          renderCellContent({
            info,
            column,
            schema,
            locale,
            schemaStore,
            routeResolver,
            openRecord,
            router,
          }),
        enableResizing: true,
        size: columnWidths[index],
        minSize: 100,
        maxSize: 1000,
      });
    });
  }, [
    gridColumns,
    columnWidths,
    disableColumnResize,
    disableColumnFilter,
    disableColumnSort,
    schema,
    setSorting,
    locale,
    schemaStore,
    routeResolver,
    openRecord,
    router,
  ]);

  return useMemo(() => {
    return [...selectionColumns, ...restColumns, ...actionColumns];
  }, [selectionColumns, restColumns, actionColumns]);
}

function renderCellHeaderContent({
  column,
  props,
  disableColumnResize,
  disableColumnFilter,
  disableColumnSort,
  onChangeSortDirection,
}: {
  column: TransformedViewColumn<SchemaAttributes>;
  props: HeaderContext<UniqueRecord, unknown>;
  disableColumnResize?: boolean;
  disableColumnFilter?: boolean;
  disableColumnSort?: boolean;
  onChangeSortDirection: (direction: 'asc' | 'desc') => void;
}) {
  return (
    <TableHeaderFilterCell
      key={column.id}
      sortDirection={props.column.getIsSorted() || undefined}
      minWidth={props.header.getSize()}
      column={column}
      resizable={!disableColumnResize}
      disableFilter={disableColumnFilter}
      disableSort={disableColumnSort}
      onChangeSortDirection={onChangeSortDirection}
      onResetSize={props.column.resetSize}
      resizeHandler={props.header.getResizeHandler()}
    >
      {column.label}
    </TableHeaderFilterCell>
  );
}

function renderCellContent({
  info,
  column,
  schema,
  schemaStore,
  locale,
  routeResolver,
  openRecord,
  router,
}: {
  info: CellContext<UniqueRecord, unknown>;
  column: TransformedViewColumn<SchemaAttributes>;
  schema: Schema;
  schemaStore: ISchemaStore;
  locale: Locale;
  routeResolver: InternalRouteResolver;
  openRecord: (id: string, logicalName: string) => void;
  router: RouterInstance;
}) {
  let attribute: Attribute | undefined;
  let value: unknown;
  if (column.expandedKey) {
    const lookup = column.name;
    const field = column.expandedKey;
    const entity = (schema.attributes[lookup] as LookupAttribute).entity;
    const lookupSchema = schemaStore.getSchema(entity);
    attribute = lookupSchema.attributes[field];
    value = info.row.original.$expand?.[lookup]?.[field];
  } else {
    attribute = schema.attributes[column.name];
    value = info.getValue();
  }

  const formattedValue =
    getAttributeFormattedValue(attribute, value, locale) ?? '';

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
    let Component: React.ComponentType<ViewColumnProps> | undefined;

    if (column.component) {
      if (typeof column.component === 'function') {
        Component = column.component;
      } else if (typeof column.component === 'string') {
        const OverrideControl = componentStore.getComponent<
          FC<ViewColumnProps>
        >(column.component);

        if (OverrideControl) {
          Component = OverrideControl;
        }
      }
    }

    if (!Component) {
      throw new Error(`Component with name ${column.component} not found`);
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
    return renderPrimaryAttribute({
      info,
      column,
      routeResolver,
      openRecord,
      schema,
      value: value as string,
    });
  }

  switch (attribute?.type) {
    case 'money':
    case 'number':
      return (
        <TableCellText
          key={column.id}
          value={formattedValue}
          width={info.column.getSize()}
          textAlignment={
            attribute.type === 'number' &&
            ['duration', 'time'].includes(attribute.format)
              ? 'left'
              : 'right'
          }
        />
      );
    case 'lookup': {
      return renderLookupAttribute({
        info,
        column,
        schemaStore,
        routeResolver,
        router,
        value,
        attribute,
        formattedValue,
      });
    }
    case 'regarding': {
      return renderRegardingAttribute({
        info,
        column,
        schemaStore,
        routeResolver,
        router,
        value,
        attribute,
        formattedValue,
      });
    }
    case 'attachment': {
      const url = (value as FileObject)?.url;
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
    }
    case 'choice':
      return (
        <TableCellChoice
          value={value}
          attribute={attribute}
          formattedValue={formattedValue}
          width={info.column.getSize()}
        />
      );
  }

  if (attribute.type === 'string' && attribute.format === 'phone') {
    const parsedNumber = parsePhoneNumber(value as string, locale.region);

    if (parsedNumber.isValid && parsedNumber.uri) {
      return (
        <TableCellLink
          key={column.id}
          value={formattedValue}
          width={info.column.getSize()}
          href={parsedNumber.uri}
        />
      );
    }
  }

  if (
    attribute.type === 'string' &&
    attribute.format === 'email' &&
    value &&
    typeof value === 'string'
  ) {
    return (
      <TableCellLink
        key={column.id}
        value={formattedValue}
        width={info.column.getSize()}
        href={`mailto:${value}`}
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
}

function renderPrimaryAttribute({
  info,
  column,
  schema,
  routeResolver,
  openRecord,
  value,
}: {
  info: CellContext<UniqueRecord, unknown>;
  column: TransformedViewColumn<SchemaAttributes>;
  schema: Schema;
  routeResolver: InternalRouteResolver;
  openRecord: (id: string, logicalName: string) => void;
  value: string;
}) {
  const path = routeResolver({
    logicalName: info.row.original.$entity,
    type: PageType.EntityForm,
    id: info.row.original[schema.idAttribute] as string,
  });

  return (
    <TableCellLink
      key={column.id}
      value={
        <Fragment>
          {renderPrimaryAttributeAvatar({
            info,
            schema,
            value,
          })}
          {value}
        </Fragment>
      }
      width={info.column.getSize()}
      href={path}
      onClick={() => {
        openRecord(
          info.row.original[schema.idAttribute] as string,
          info.row.original.$entity
        );
      }}
    />
  );
}

function renderPrimaryAttributeAvatar({
  info,
  schema,
  value,
}: {
  info: CellContext<UniqueRecord, unknown>;
  schema: Schema;
  value: string;
}) {
  if (!schema.avatarAttribute) {
    return null;
  }

  const avatarAttribute = schema.attributes[schema.avatarAttribute];

  if (avatarAttribute.type !== 'attachment') {
    return null;
  }

  const avatarValue = info.row.original[schema.avatarAttribute] as
    | FileObject
    | undefined;

  return (
    <Avatar
      style={{
        width: 24,
        height: 24,
        fontSize: tokens.fontSizeBase100,
      }}
      name={value}
      color={getAvatarColor(value)}
      image={{
        src: avatarValue?.url,
      }}
    />
  );
}

function renderLookupAttribute({
  value,
  info,
  column,
  schemaStore,
  routeResolver,
  router,
  attribute,
  formattedValue,
}: {
  value: unknown;
  info: CellContext<UniqueRecord, unknown>;
  column: TransformedViewColumn<SchemaAttributes>;
  schemaStore: ISchemaStore;
  routeResolver: InternalRouteResolver;
  router: RouterInstance;
  attribute: LookupAttribute;
  formattedValue: string;
}) {
  if (!value) {
    return (
      <TableCellText key={column.id} value="" width={info.column.getSize()} />
    );
  }

  const lookupSchema = schemaStore.getSchema(attribute.entity);

  const path = routeResolver({
    logicalName: attribute.entity,
    type: PageType.EntityForm,
    id: (value as unknown as DataLookup<Id>).id as string,
  });

  return (
    <TableCellLink
      key={column.id}
      value={
        <Fragment>
          {!!lookupSchema.avatarAttribute && (
            <Avatar
              style={{
                width: 24,
                height: 24,
                fontSize: tokens.fontSizeBase100,
              }}
              name={formattedValue}
              color={getAvatarColor(formattedValue)}
              image={{
                src: (value as unknown as DataLookup<Id>).avatar as string,
              }}
            />
          )}
          {formattedValue}
        </Fragment>
      }
      width={info.column.getSize()}
      href={path}
      onClick={() => {
        router.push(path);
      }}
    />
  );
}

function renderRegardingAttribute({
  value,
  info,
  column,
  schemaStore,
  routeResolver,
  router,
  formattedValue,
}: {
  value: unknown;
  info: CellContext<UniqueRecord, unknown>;
  column: TransformedViewColumn<SchemaAttributes>;
  schemaStore: ISchemaStore;
  routeResolver: InternalRouteResolver;
  router: RouterInstance;
  attribute: RegardingAttribute;
  formattedValue: string;
}) {
  if (!value) {
    return (
      <TableCellText key={column.id} value="" width={info.column.getSize()} />
    );
  }

  const hasSchema = schemaStore.hasSchema((value as any).logicalName as string);

  if (!hasSchema) {
    return (
      <TableCellText key={column.id} value="" width={info.column.getSize()} />
    );
  }

  const logicalName = (value as any).logicalName as string;

  const lookupSchema = schemaStore.getSchema(logicalName);

  const path = routeResolver({
    logicalName,
    type: PageType.EntityForm,
    id: (value as unknown as DataLookup<Id>).id as string,
  });

  return (
    <TableCellLink
      key={column.id}
      value={
        <Fragment>
          {!!lookupSchema.avatarAttribute && (
            <Avatar
              style={{
                width: 24,
                height: 24,
                fontSize: tokens.fontSizeBase100,
              }}
              name={formattedValue}
              color={getAvatarColor(formattedValue)}
              image={{
                src: (value as unknown as DataLookup<Id>).avatar as string,
              }}
            />
          )}
          {formattedValue}
        </Fragment>
      }
      width={info.column.getSize()}
      href={path}
      onClick={() => {
        router.push(path);
      }}
    />
  );
}
