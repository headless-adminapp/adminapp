import { Attribute, LookupAttribute } from '@headless-adminapp/core/attributes';
import {
  ColumnCondition,
  SortingState,
  View,
} from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { Filter, IDataService } from '@headless-adminapp/core/transport';

import { TransformedViewColumn } from '../datagrid';
import {
  collectExpandedKeys,
  mergeConditions,
} from '../datagrid/DataGridProvider/utils';
import { getAttributeFormattedValue } from '../utils';

type ExportFn<S extends SchemaAttributes = SchemaAttributes> = (option: {
  schema: Schema<S>;
  records: unknown[];
  gridColumns: TransformedViewColumn<SchemaAttributes>[];
  schemaStore: ISchemaStore;
  fileName: string;
}) => Promise<void>;

const getHeaders = (
  schema: Schema,
  gridColumns: TransformedViewColumn<SchemaAttributes>[],
  schemaStore: ISchemaStore
) => {
  const headers = gridColumns.map((column) => {
    if (column.name.indexOf('.') !== -1) {
      const [lookup, field] = column.name.split('.');
      const entity = (schema.attributes[lookup] as LookupAttribute).entity;
      const lookupSchema = schemaStore.getSchema(entity);
      return `${lookupSchema.attributes[field]?.label} (${schema.attributes[lookup]?.label})`;
    }

    return schema.attributes[column.name]?.label;
  });

  return headers;
};

function getAttribute({
  column,
  schema,
  schemaStore,
}: {
  schema: Schema;
  column: TransformedViewColumn<SchemaAttributes>;
  schemaStore: ISchemaStore;
}) {
  let attribute: Attribute | undefined;
  if (column.expandedKey) {
    const lookup = column.name;
    const field = column.expandedKey;
    const entity = (schema.attributes[lookup] as LookupAttribute).entity;
    const lookupSchema = schemaStore.getSchema(entity);
    attribute = lookupSchema.attributes[field];
  } else {
    attribute = schema.attributes[column.name];
  }

  return attribute;
}

function extractAttributeData({
  column,
  record,
  schema,
  schemaStore,
}: {
  schema: Schema;
  column: TransformedViewColumn<SchemaAttributes>;
  schemaStore: ISchemaStore;
  record: any;
}) {
  const attribute = getAttribute({ column, schema, schemaStore });
  let value: unknown;
  if (column.expandedKey) {
    const lookup = column.name;
    const field = column.expandedKey;
    value = record.$expand?.[lookup]?.[field];
  } else {
    value = record[column.name];
  }

  return {
    attribute,
    value,
  };
}

export const exportRecordsCSV: ExportFn = async ({
  schema,
  records,
  gridColumns,
  schemaStore,
  fileName,
}) => {
  const csvDownload = await import('json-to-csv-export');

  const headers = getHeaders(schema, gridColumns, schemaStore);

  const cellData = records.map((record: any) => {
    return gridColumns.map((column) => {
      const { attribute, value } = extractAttributeData({
        column,
        record,
        schema,
        schemaStore,
      });

      if (attribute.type === 'money' || attribute.type === 'number') {
        return value?.toString() ?? '';
      }

      return getAttributeFormattedValue(attribute, value) ?? '';
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
  schema,
  schemaStore,
}) => {
  const ExcelJS = await import('exceljs');
  const headers = getHeaders(schema, gridColumns, schemaStore);

  const cellData = records.map((item: any) => {
    return gridColumns.map((column) => {
      const { attribute, value } = extractAttributeData({
        column,
        record: item,
        schema,
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
          return getAttributeFormattedValue(attribute, value);
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
    const attribute = getAttribute({ column, schema, schemaStore });

    const sheetColumn = worksheet.getColumn(index + 1);

    let formatFn = (value: any) =>
      getAttributeFormattedValue(attribute, value) ?? '';

    if (attribute?.type === 'money') {
      sheetColumn.numFmt = '"₹" #,##0.00';
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

  var blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

export async function retriveRecords<
  S extends SchemaAttributes = SchemaAttributes
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
  sorting: SortingState<S>;
  skip: number;
  limit: number;
}) {
  const expand = collectExpandedKeys(gridColumns);

  const columns = Array.from(
    new Set([...gridColumns.filter((x) => !x.expandedKey).map((x) => x.name)])
  );

  const result = await dataService.retriveRecords<InferredSchemaType<S>>({
    logicalName: schema.logicalName,
    search,
    columns: columns as unknown as Array<keyof InferredSchemaType<S>>,
    expand,
    filter: mergeConditions(
      schema,
      view.experience.filter,
      extraFilter,
      columnFilters,
      schemaStore
    ),
    skip,
    limit,
    sort: sorting as any,
  });

  return result;
}
