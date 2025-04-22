import { Schema } from '@headless-adminapp/core/schema';
import { RetriveRecordsParams } from '@headless-adminapp/core/transport';
import { urlToFileObject } from '@headless-adminapp/core/utils';

import { SequelizeSchemaStore } from '../SequelizeSchemaStore';

function transformColumns({
  recordJson,
  transformedRecord,
  schema,
  columns,
  schemaStore,
}: {
  recordJson: any;
  transformedRecord: Record<string, any>;
  schema: Schema;
  columns: string[];
  schemaStore: SequelizeSchemaStore;
}) {
  for (const column of columns) {
    const attribute = schema.attributes[column];

    if (!attribute) {
      continue;
    }

    if (attribute.type === 'lookup') {
      const lookupSchema = schemaStore.getSchema(attribute.entity);

      const expandedValue =
        recordJson[
          schemaStore.getRelationAlias(
            schema.collectionName ?? schema.logicalName,
            column,
            lookupSchema.collectionName ?? lookupSchema.logicalName
          )
        ];

      if (!recordJson[column] || !expandedValue) {
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
      const regardingid = recordJson[column];

      if (!regardingid) {
        transformedRecord[column] = null;
      }

      const regardingType = recordJson[attribute.entityTypeAttribute];

      if (!regardingType) {
        transformedRecord[column] = null;
        continue;
      }

      const hasScheam = schemaStore.hasSchema(regardingType);

      if (!hasScheam) {
        transformedRecord[column] = null;
        continue;
      }

      const regardingSchema = schemaStore.getSchema(regardingType);

      const expandedValue =
        recordJson[
          schemaStore.getRelationAlias(
            schema.collectionName ?? schema.logicalName,
            column,
            regardingSchema.collectionName ?? regardingSchema.logicalName
          )
        ];

      if (!expandedValue) {
        transformedRecord[column] = null;
      } else {
        transformedRecord[column] = {
          id: expandedValue[regardingSchema.idAttribute],
          name: expandedValue[regardingSchema.primaryAttribute],
          avatar: regardingSchema.avatarAttribute
            ? expandedValue[regardingSchema.avatarAttribute]
            : null,
          logicalName: regardingSchema.logicalName,
        };
      }
    } else if (attribute.type === 'attachment') {
      if (recordJson[column]) {
        transformedRecord[column] = urlToFileObject(recordJson[column]);
      } else {
        transformedRecord[column] = null;
      }
    } else {
      transformedRecord[column] = recordJson[column];
    }
  }
}

const transformExpandedRecord = ({
  recordJson,
  transformedRecord,
  schema,
  expand,
  schemaStore,
}: {
  recordJson: any;
  transformedRecord: Record<string, any>;
  schema: Schema;
  expand: Required<RetriveRecordsParams>['expand'];
  schemaStore: SequelizeSchemaStore;
}) => {
  transformedRecord['$expand'] = {};

  for (const expandKey of Object.keys(expand)) {
    const expandedColumns = expand[expandKey]!;
    const expandedAttribute = schema.attributes[expandKey];

    if (!expandedAttribute || expandedAttribute.type !== 'lookup') {
      continue;
    }

    const expandedSchema = schemaStore.getSchema(expandedAttribute.entity);

    const expandedRecord =
      recordJson[
        schemaStore.getRelationAlias(
          schema.collectionName ?? schema.logicalName,
          expandKey,
          expandedSchema.collectionName ?? expandedSchema.logicalName
        )
      ];

    if (!expandedRecord) {
      continue;
    }

    transformedRecord['$expand'][expandKey] = {
      '@data:entity': expandedAttribute.entity,
    };

    Object.assign(
      transformedRecord['$expand'][expandKey],
      expandedColumns.reduce((acc, column) => {
        const attribute = expandedSchema.attributes[column];
        if (!attribute) {
          return acc;
        }

        if (attribute.type === 'lookup') {
          const nestedExpandedSchema = schemaStore.getSchema(attribute.entity);
          const nestedExpandedRecord =
            expandedRecord[
              schemaStore.getRelationAlias(
                expandedSchema.collectionName ?? expandedSchema.logicalName,
                column,
                nestedExpandedSchema.collectionName ??
                  nestedExpandedSchema.logicalName
              )
            ];

          if (!nestedExpandedRecord) {
            acc[column] = null;
          } else {
            acc[column] = {
              id: nestedExpandedRecord[expandedSchema.idAttribute],
              name: nestedExpandedRecord[expandedSchema.primaryAttribute],
              logicalName: attribute.entity,
            };
          }
        } else {
          acc[column] = expandedRecord[column];
        }

        return acc;
      }, {} as Record<string, any>)
    );
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
  schemaStore: SequelizeSchemaStore;
}) {
  const recordJson = record.toJSON();

  const transformedRecord = {
    $entity: schema.logicalName,
  } as Record<string, any>;

  if (
    schema.virtual &&
    schema.virtualLogicalNameAttribute &&
    recordJson[schema.virtualLogicalNameAttribute]
  ) {
    transformedRecord.$entity = recordJson[schema.virtualLogicalNameAttribute];
  }

  transformedRecord[schema.idAttribute] = recordJson[schema.idAttribute];

  if (columns) {
    transformColumns({
      recordJson,
      transformedRecord,
      schema,
      columns,
      schemaStore,
    });
  }

  if (expand) {
    transformExpandedRecord({
      recordJson,
      transformedRecord,
      schema,
      expand,
      schemaStore,
    });
  }

  return transformedRecord;
}
