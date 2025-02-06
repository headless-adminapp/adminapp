import { LookupAttribute } from '../attributes';
import { Schema, SchemaAttributes } from '../schema';
import { ISchemaStore } from './ISchemaStore';

export class SchemaStore<SA extends SchemaAttributes = SchemaAttributes>
  implements ISchemaStore<SA>
{
  private schemas: Record<string, Schema<SA>> = {};

  register<S extends SA = SA>(schema: Schema<S>) {
    this.schemas[schema.logicalName] = schema as unknown as Schema<SA>;
  }

  hasSchema(logicalName: string): boolean {
    return !!this.schemas[logicalName];
  }

  getAllSchema() {
    return this.schemas;
  }

  getSchema<S extends SA = SA>(logicalName: string): Schema<S> {
    if (!this.schemas[logicalName]) {
      throw new Error(`Schema ${logicalName} not found`);
    }

    return this.schemas[logicalName] as unknown as Schema<S>;
  }

  validate() {
    const allSchemas = Object.values(this.schemas);

    for (const schema of allSchemas) {
      const primaryAttribute = schema.attributes[schema.primaryAttribute];

      if (!primaryAttribute) {
        throw new Error(
          `Schema ${schema.logicalName} does not have primary attribute`
        );
      }

      if (primaryAttribute.type !== 'string') {
        throw new Error(
          `Primary attribute ${schema.primaryAttribute as string} of schema ${
            schema.logicalName
          } must be of type string`
        );
      }

      if (schema.avatarAttribute) {
        const avatarAttribute = schema.attributes[schema.avatarAttribute];

        if (!avatarAttribute) {
          throw new Error(
            `Schema ${schema.logicalName} does not have avatar attribute`
          );
        }

        if (avatarAttribute.type !== 'attachment') {
          throw new Error(
            `Avatar attribute ${schema.avatarAttribute as string} of schema ${
              schema.logicalName
            } must be of type image attachment`
          );
        }
      }

      const lookupAttributes = Object.entries(schema.attributes).filter(
        ([_, attr]) => attr.type === 'lookup'
      ) as [string, LookupAttribute][];

      for (const [key, lookupAttribute] of lookupAttributes) {
        const lookupSchema = this.schemas[lookupAttribute.entity];

        if (!lookupSchema) {
          throw new Error(
            `Schema ${schema.logicalName} has lookup attribute ${key} with target ${lookupAttribute.entity} which does not exist`
          );
        }
      }
    }
  }
}
