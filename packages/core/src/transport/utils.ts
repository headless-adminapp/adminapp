import type { DataLookup, Id } from '../attributes';
import type { InferredSchemaType, Schema, SchemaAttributes } from '../schema';

export function getRecordId<S extends SchemaAttributes = SchemaAttributes>(
  schema: Schema<S>,
  data: InferredSchemaType<SchemaAttributes>,
): Id {
  const attribute = schema.attributes[schema.idAttribute];

  if (!attribute) {
    throw new Error(
      `Id attribute ${schema.idAttribute} not found in schema ${schema.logicalName}`,
    );
  }

  const idValue = data[schema.idAttribute];

  if (attribute.type === 'lookup') {
    return (idValue as DataLookup<string>)?.id;
  }

  return idValue as Id;
}

export function getRecordPrimaryName<
  S extends SchemaAttributes = SchemaAttributes,
>(schema: Schema<S>, data: InferredSchemaType<SchemaAttributes>): string {
  const attribute = schema.attributes[schema.primaryAttribute];

  if (!attribute) {
    throw new Error(
      `Primary attribute ${schema.primaryAttribute} not found in schema ${schema.logicalName}`,
    );
  }

  const nameValue = data[schema.primaryAttribute];

  if (attribute.type === 'lookup') {
    return (nameValue as DataLookup<string>)?.name;
  }

  return nameValue as string;
}
