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
            schema.logicalName,
            column,
            attribute.entity
          )
        ];

      if (!recordJson[column] || !expandedValue) {
        transformedRecord[column] = null;
      } else {
        transformedRecord[column] = {
          id: expandedValue[lookupSchema.idAttribute],
          name: expandedValue[lookupSchema.primaryAttribute],
          logicalName: attribute.entity,
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
          schema.logicalName,
          expandKey,
          expandedAttribute.entity
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
          const nestedExpandedRecord =
            expandedRecord[
              schemaStore.getRelationAlias(
                expandedAttribute.entity,
                column,
                attribute.entity
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
