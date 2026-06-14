/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RegardingAttribute } from '@headless-adminapp/core/attributes/LookupAttribute';
import type { Schema } from '@headless-adminapp/core/schema';
import type { ISchemaStore } from '@headless-adminapp/core/store';
import type { RetriveRecordsParams } from '@headless-adminapp/core/transport';
import type { ExpandOptions } from '@headless-adminapp/core/transport/operations/RetriveRecords';
import { urlToFileObject } from '@headless-adminapp/core/utils';
import dayjs from 'dayjs';

function transformLookup({
  record,
  column,
  lookupEntity,
  schemaStore,
}: {
  record: Record<string, any>;
  column: string;
  lookupEntity: string;
  schemaStore: ISchemaStore;
}) {
  const lookupSchema = schemaStore.getSchema(lookupEntity);
  const expandedRecord = record['@expand']?.[column]?.[lookupEntity];

  if (!record[column] || !expandedRecord) {
    return null;
  } else {
    return {
      id: expandedRecord[lookupSchema.idAttribute],
      name: expandedRecord[lookupSchema.primaryAttribute],
      avatar: lookupSchema.avatarAttribute
        ? expandedRecord[lookupSchema.avatarAttribute]
        : null,
      logicalName: lookupEntity,
    };
  }
}

function transformRegarding({
  column,
  record,
  attribute,
  schemaStore,
}: {
  column: string;
  record: Record<string, any>;
  attribute: RegardingAttribute;
  schemaStore: ISchemaStore;
}) {
  const entity = record[attribute.entityTypeAttribute];

  if (!entity) {
    return null;
  }

  const expandedRecord = record['@expand']?.[column]?.[entity];
  const lookupSchema = schemaStore.getSchema(entity);

  if (!record[column] || !expandedRecord) {
    return null;
  } else {
    return {
      id: expandedRecord[lookupSchema.idAttribute],
      name: expandedRecord[lookupSchema.primaryAttribute],
      avatar: lookupSchema.avatarAttribute
        ? expandedRecord[lookupSchema.avatarAttribute]
        : null,
      logicalName: entity,
    };
  }
}

function transformColumn({
  column,
  record,
  schema,
  schemaStore,
}: {
  column: string;
  record: Record<string, any>;
  schema: Schema;
  schemaStore: ISchemaStore;
}) {
  const attribute = schema.attributes[column];

  if (!attribute) {
    return;
  }

  if (attribute.type === 'lookup') {
    return transformLookup({
      record,
      column,
      lookupEntity: attribute.entity,
      schemaStore,
    });
  } else if (attribute.type === 'regarding') {
    return transformRegarding({
      column,
      record,
      attribute,
      schemaStore,
    });
  } else if (attribute.type === 'date' && attribute.format === 'date') {
    if (record[column]) {
      return dayjs(record[column]).utc().format('YYYY-MM-DD');
    } else {
      return null;
    }
  } else if (attribute.type === 'attachment') {
    if (record[column]) {
      return urlToFileObject(record[column]);
    } else {
      return null;
    }
  } else if (attribute.type === 'choice') {
    if (record[column]) {
      const value = record[column];
      return {
        value: value,
        label:
          attribute.options?.find((option) => option.value === value)?.label ||
          value,
      };
    } else {
      return null;
    }
  } else if (attribute.type === 'string' && attribute.format === 'password') {
    if (!attribute.redact) {
      return record[column];
    } else {
      if (record[column]) {
        return '********';
      } else {
        return null;
      }
    }
  } else {
    return record[column];
  }
}

export function transformColumns({
  record,
  transformedRecord,
  schema,
  columns,
  schemaStore,
}: {
  record: any;
  transformedRecord: Record<string, any>;
  schema: Schema;
  columns: string[];
  schemaStore: ISchemaStore;
}) {
  for (const column of columns) {
    const result = transformColumn({
      column,
      record,
      schema,
      schemaStore,
    });
    if (result !== undefined) {
      transformedRecord[column] = result;
    }
  }
}

const transformExpandedInfo = ({
  record,
  schema,
  expandKey,
  schemaStore,
  expandInfo,
}: {
  record: any;
  schema: Schema;
  expandKey: string;
  schemaStore: ISchemaStore;
  expandInfo: ExpandOptions<Record<string, unknown>>[string];
}) => {
  const expandedAttribute = schema.attributes[expandKey];

  if (!expandedAttribute) return;

  let entity: string | undefined;

  if (expandedAttribute.type === 'lookup') {
    entity = expandedAttribute.entity;
  } else if (expandedAttribute.type === 'regarding') {
    entity = record[expandedAttribute.entityTypeAttribute];
  }

  if (!entity) {
    return;
  }

  const expandedSchema = schemaStore.getSchema(entity);

  const expandedRecord = record['@expand']?.[expandKey]?.[entity];

  if (!expandedRecord) {
    return;
  }

  const transformedRecord = {
    $entity: entity,
  } as Record<string, any>;

  let id = expandedRecord[expandedSchema.idAttribute];

  if (typeof id === 'object') {
    id = id.toString();
  }
  transformedRecord[expandedSchema.idAttribute] = id;

  const expandedColumns = Array.isArray(expandInfo)
    ? expandInfo
    : expandInfo?.columns || [];

  Object.assign(
    transformedRecord,
    expandedColumns.reduce(
      (acc, column) => {
        const result = transformColumn({
          column,
          record: expandedRecord,
          schema: expandedSchema,
          schemaStore,
        });

        if (result === undefined) {
          return acc;
        }

        acc[column] = result;
        return acc;
      },
      {} as Record<string, any>,
    ),
  );

  if (!Array.isArray(expandInfo) && expandInfo?.expand) {
    transformedRecord['$expand'] = {};
    for (const expandKey of Object.keys(expandInfo.expand)) {
      const nestedExpandInfo = expandInfo.expand[expandKey];

      if (!nestedExpandInfo) {
        continue;
      }

      const nestedSchema = schemaStore.getSchema(entity);

      const result = transformExpandedInfo({
        schema: nestedSchema,
        expandKey,
        schemaStore,
        expandInfo: nestedExpandInfo,
        record: expandedRecord,
      });

      if (!result) {
        continue;
      }

      transformedRecord['$expand'][expandKey] = result;
    }
  }

  return transformedRecord;
};

const transformExpandedRecord = ({
  record,
  transformedRecord,
  schema,
  expand,
  schemaStore,
}: {
  record: any;
  transformedRecord: Record<string, any>;
  schema: Schema;
  expand: Required<RetriveRecordsParams>['expand'];
  schemaStore: ISchemaStore;
}) => {
  transformedRecord['$expand'] = {};

  for (const expandKey of Object.keys(expand)) {
    const expandInfo = expand[expandKey];

    if (!expandInfo) {
      continue;
    }

    const result = transformExpandedInfo({
      schema,
      expandKey,
      schemaStore,
      expandInfo,
      record,
    });

    if (!result) {
      continue;
    }

    transformedRecord['$expand'][expandKey] = result;
  }
};

export function transformRecord({
  record,
  schema,
  columns,
  expand,
  schemaStore,
}: {
  record: any;
  schema: Schema;
  columns?: string[];
  expand?: RetriveRecordsParams['expand'];
  schemaStore: ISchemaStore;
}) {
  let logicalName = schema.logicalName;

  if (schema.virtual && schema.virtual.baseSchemaLogicalNameAttribute) {
    const virtualLogicalName =
      record[schema.virtual.baseSchemaLogicalNameAttribute];

    if (virtualLogicalName) {
      logicalName = virtualLogicalName;
    }
  }

  const transformedRecord = {
    $entity: logicalName,
  } as Record<string, any>;

  let id = record[schema.idAttribute];

  if (typeof id === 'object') {
    id = id.toString();
  }
  transformedRecord[schema.idAttribute] = id;

  if (columns) {
    transformColumns({
      record,
      transformedRecord,
      schema, //: schema as Schema<SchemaAttributes>,
      columns,
      schemaStore,
    });
  }

  if (expand) {
    transformExpandedRecord({
      record,
      transformedRecord,
      schema,
      expand,
      schemaStore,
    });
  }

  return transformedRecord;
}
