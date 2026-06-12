import type {
  Attribute,
  LookupAttribute,
} from '@headless-adminapp/core/attributes';
import type { Locale } from '@headless-adminapp/core/experience/locale';
import type {
  ColumnCondition,
  SortingState,
  View,
} from '@headless-adminapp/core/experience/view';
import type { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import type { ISchemaStore } from '@headless-adminapp/core/store';
import type { Filter, IDataService } from '@headless-adminapp/core/transport';

import type { TransformedViewColumn } from '../datagrid';
import {
  collectExpandedKeys,
  mergeConditions,
} from '../datagrid/DataGridProvider/utils';
import { getAttributeFormattedValue } from '../utils';

export type ExportColumn<S extends SchemaAttributes = SchemaAttributes> = Omit<
  TransformedViewColumn<S>,
  'id' | 'component' | 'width' | 'maxWidth'
>;

export type ExportFn<S extends SchemaAttributes = SchemaAttributes> = (option: {
  attributes: S;
  records: unknown[];
  gridColumns: ExportColumn<S>[];
  schemaStore: ISchemaStore;
  fileName: string;
  locale: Locale;
}) => Promise<void>;

const getHeaders = (
  attributes: SchemaAttributes,
  gridColumns: ExportColumn<SchemaAttributes>[],
  schemaStore: ISchemaStore,
) => {
  const headers = gridColumns.map((column) => {
    if (column.name.indexOf('.') !== -1) {
      const [lookup, field] = column.name.split('.');
      const entity = (attributes[lookup] as LookupAttribute).entity;
      const lookupSchema = schemaStore.getSchema(entity);
      return `${lookupSchema.attributes[field]?.label} (${attributes[lookup]?.label})`;
    }

    return column.label ?? attributes[column.name]?.label;
  });

  return headers;
};

function getAttribute({
  column,
  attributes,
  schemaStore,
}: {
  attributes: SchemaAttributes;
  column: ExportColumn<SchemaAttributes>;
  schemaStore: ISchemaStore;
}) {
  let attribute: Attribute | undefined;
  if (column.expandedKey) {
    const lookup = column.name;
    const field = column.expandedKey;
    const entity = (attributes[lookup] as LookupAttribute).entity;
    const lookupSchema = schemaStore.getSchema(entity);
    attribute = lookupSchema.attributes[field];
  } else {
    attribute = attributes[column.name];
  }

  return attribute;
}

function extractAttributeData({
  column,
  record,
  attributes,
  schemaStore,
}: {
  attributes: SchemaAttributes;
  column: ExportColumn<SchemaAttributes>;
  schemaStore: ISchemaStore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record: any;
}) {
  const attribute = getAttribute({
    column,
    attributes,
    schemaStore,
  });
  let value: unknown;
  if (column.expandedKey) {
    const lookup = column.name;
    const field = column.expandedKey;
    const entity = (attributes[lookup] as LookupAttribute).entity;
    value = record.$expand?.[lookup]?.[field]?.[entity];
  } else {
    value = record[column.name];
  }

  return {
    attribute,
    value,
  };
}

export const exportRecordsCSV: ExportFn = async ({
  attributes,
  records,
  gridColumns,
  schemaStore,
  fileName,
  locale,
}) => {
  const csvDownload = await import('json-to-csv-export');

  const headers = getHeaders(attributes, gridColumns, schemaStore);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cellData = records.map((record: any) => {
    return gridColumns.map((column) => {
      const { attribute, value } = extractAttributeData({
        column,
        record,
        attributes,
        schemaStore,
      });

      if (attribute.type === 'money' || attribute.type === 'number') {
        return value?.toString() ?? '';
      }

      return getAttributeFormattedValue(attribute, value, locale) ?? '';
    });
  });

  csvDownload.default({
    headers,
    data: cellData,
    delimiter: ',',
    filename: fileName,
  });
};

export const exportRecordsXLS: ExportFn = async ({
  fileName,
  gridColumns,
  records,
  attributes,
  schemaStore,
  locale,
}) => {
  const ExcelJS = await import('exceljs');
  const headers = getHeaders(attributes, gridColumns, schemaStore);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cellData = records.map((item: any) => {
    return gridColumns.map((column) => {
      const { attribute, value } = extractAttributeData({
        column,
        record: item,
        attributes,
        schemaStore,
      });

      if (!value) {
        return '';
      }

      switch (attribute?.type) {
        case 'money':
        case 'number':
          return value;
        case 'date':
          return value ? new Date(value as string) : undefined;
        default:
          return getAttributeFormattedValue(attribute, value, locale);
      }
    });
  });

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.addRow(headers);

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };

  cellData.forEach((row) => {
    worksheet.addRow(row);
  });

  gridColumns.forEach((column, index) => {
    const attribute = getAttribute({
      column,
      attributes: attributes,
      schemaStore,
    });

    const sheetColumn = worksheet.getColumn(index + 1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatFn = (value: any) =>
      getAttributeFormattedValue(attribute, value, locale) ?? '';

    if (attribute?.type === 'money') {
      sheetColumn.numFmt = `"₹" #,##0.00`;
    }

    let maxLength = 0;
    sheetColumn.eachCell((cell) => {
      const length = formatFn(cell.value).length;
      if (length > maxLength) {
        maxLength = length;
      }
    });

    sheetColumn.width = Math.max(maxLength, 10) * 1.2;
  });

  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

export async function retriveRecords<
  S extends SchemaAttributes = SchemaAttributes,
>({
  gridColumns,
  dataService,
  schema,
  search,
  view,
  extraFilter,
  columnFilters,
  schemaStore,
  sorting,
  skip,
  limit,
}: {
  gridColumns: TransformedViewColumn<SchemaAttributes>[];
  dataService: IDataService;
  schema: Schema<S>;
  search?: string;
  view: View<S>;
  extraFilter?: Filter;
  columnFilters?: Partial<Record<string, ColumnCondition>>;
  schemaStore: ISchemaStore;
  sorting: SortingState<Extract<keyof S, string>>;
  skip: number;
  limit: number;
}) {
  const expand = collectExpandedKeys(gridColumns);

  const columns = Array.from(
    new Set([...gridColumns.filter((x) => !x.expandedKey).map((x) => x.name)]),
  );

  const result = await dataService.retriveRecords<S>({
    logicalName: schema.logicalName,
    search,
    columns: columns as Array<keyof S>,
    expand,
    filter: mergeConditions(
      schema,
      view.experience.filter,
      extraFilter,
      null, // quickFilterResults
      columnFilters,
      schemaStore,
    ),
    skip,
    limit,
    sort: sorting,
  });

  return result;
}
