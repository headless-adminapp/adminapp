import { Schema } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { RetriveRecordsParams } from '@headless-adminapp/core/transport';

function transformColumns({
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

      const expandedValue = record['@expand']?.[column];

      if (!record[column] || !expandedValue) {
        transformedRecord[column] = null;
      } else {
        transformedRecord[column] = {
          id: expandedValue[lookupSchema.idAttribute],
          name: expandedValue[lookupSchema.primaryAttribute],
          logicalName: attribute.entity,
        };
      }
    } else {
      transformedRecord[column] = record[column];
    }
  }
}

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
    const expandedColumns = expand[expandKey]!;
    const expandedAttribute = schema.attributes[expandKey];

    if (!expandedAttribute || expandedAttribute.type !== 'lookup') {
      continue;
    }

    const expandedSchema = schemaStore.getSchema(expandedAttribute.entity);

    const expandedRecord = record['@expand']?.[expandKey];

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
          const nestedExpandedRecord = expandedRecord['@expand']?.[column];

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
  schemaStore: ISchemaStore;
}) {
  const transformedRecord = {
    $entity: schema.logicalName,
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
