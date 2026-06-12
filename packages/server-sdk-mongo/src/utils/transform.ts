/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema } from '@headless-adminapp/core/schema';
import type { ISchemaStore } from '@headless-adminapp/core/store';
import type { RetriveRecordsParams } from '@headless-adminapp/core/transport';
import type { ExpandOptions } from '@headless-adminapp/core/transport/operations/RetriveRecords';
import { urlToFileObject } from '@headless-adminapp/core/utils';
import dayjs from 'dayjs';

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
    const attribute = schema.attributes[column];

    if (!attribute) {
      continue;
    }

    if (attribute.type === 'lookup') {
      const lookupSchema = schemaStore.getSchema(attribute.entity);

      const expandedValue = record['@expand']?.[column]?.[attribute.entity];

      if (!record[column] || !expandedValue) {
        transformedRecord[column] = null;
      } else {
        transformedRecord[column] = {
          id: expandedValue[lookupSchema.idAttribute],
          name: expandedValue[lookupSchema.primaryAttribute],
          avatar: lookupSchema.avatarAttribute
            ? expandedValue[lookupSchema.avatarAttribute]
            : null,
          logicalName: attribute.entity,
        };
      }
    } else if (attribute.type === 'regarding') {
      const entity = record[attribute.entityTypeAttribute];

      if (!entity) {
        transformedRecord[column] = null;
        continue;
      }

      const expandedValue = record['@expand']?.[column]?.[entity];
      const lookupSchema = schemaStore.getSchema(entity);

      if (!record[column] || !expandedValue) {
        transformedRecord[column] = null;
      } else {
        transformedRecord[column] = {
          id: expandedValue[lookupSchema.idAttribute],
          name: expandedValue[lookupSchema.primaryAttribute],
          avatar: lookupSchema.avatarAttribute
            ? expandedValue[lookupSchema.avatarAttribute]
            : null,
          logicalName: entity,
        };
      }
    } else if (attribute.type === 'date' && attribute.format === 'date') {
      if (record[column]) {
        transformedRecord[column] = dayjs(record[column])
          .utc()
          .format('YYYY-MM-DD');
      } else {
        transformedRecord[column] = null;
      }
    } else if (attribute.type === 'attachment') {
      if (record[column]) {
        transformedRecord[column] = urlToFileObject(record[column]);
      } else {
        transformedRecord[column] = null;
      }
    } else if (attribute.type === 'choice') {
      if (record[column]) {
        const value = record[column];
        transformedRecord[column] = {
          value: value,
          label:
            attribute.options?.find((option) => option.value === value)
              ?.label || value,
        };
      } else {
        transformedRecord[column] = null;
      }
    } else if (attribute.type === 'string' && attribute.format === 'password') {
      if (!attribute.redact) {
        transformedRecord[column] = record[column];
      } else {
        if (record[column]) {
          transformedRecord[column] = '********';
        } else {
          transformedRecord[column] = null;
        }
      }
    } else {
      transformedRecord[column] = record[column];
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

  const expandedColumns = Array.isArray(expandInfo)
    ? expandInfo
    : expandInfo?.columns || [];

  Object.assign(
    transformedRecord,
    expandedColumns.reduce(
      (acc, column) => {
        const attribute = expandedSchema.attributes[column];
        if (!attribute) {
          return acc;
        }

        if (attribute.type === 'lookup') {
          const nestedExpandedRecord =
            expandedRecord['@expand']?.[column]?.[attribute.entity];
          const nestedSchema = schemaStore.getSchema(attribute.entity);

          if (!nestedExpandedRecord) {
            acc[column] = null;
          } else {
            acc[column] = {
              id: nestedExpandedRecord[nestedSchema.idAttribute],
              name: nestedExpandedRecord[nestedSchema.primaryAttribute],
              logicalName: attribute.entity,
              avatar: nestedSchema.avatarAttribute
                ? nestedExpandedRecord[nestedSchema.avatarAttribute]
                : null,
            };
          }
        } else if (attribute.type === 'date' && attribute.format === 'date') {
          if (expandedRecord[column]) {
            acc[column] = dayjs(expandedRecord[column])
              .utc()
              .format('YYYY-MM-DD');
          } else {
            acc[column] = null;
          }
        } else if (attribute.type === 'attachment') {
          if (expandedRecord[column]) {
            acc[column] = urlToFileObject(expandedRecord[column]);
          } else {
            acc[column] = null;
          }
        } else {
          acc[column] = expandedRecord[column];
        }

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
