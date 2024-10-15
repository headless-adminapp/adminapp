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
}
