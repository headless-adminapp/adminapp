import { Schema, SchemaAttributes } from '../schema';

export interface ISchemaStore<SA extends SchemaAttributes = SchemaAttributes> {
  getAllSchema(): Record<string, Schema<SA>>;
  hasSchema(logicalName: string): boolean;
  getSchema<S extends SA = SA>(logicalName: string): Schema<S>;
  validate(): void;
}
