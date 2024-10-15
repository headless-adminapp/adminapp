import { typeSafeFn } from '../utils';
import type { Schema } from './Schema';
import { SchemaAttributes } from './SchemaAttributes';

export function createSchemaDefiner<T extends SchemaAttributes>() {
  return function defineSchema<S extends T>(schema: Schema<S>): Schema<S> {
    return schema;
  };
}

export const defineSchema = createSchemaDefiner();

export const defineSchemaAttributes = typeSafeFn<SchemaAttributes>();
