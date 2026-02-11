import { typeSafeFn } from '../../utils';
import type { Schema } from '../Schema';
import { SchemaAttributes } from '../SchemaAttributes';

export function createSchemaDefiner<T extends SchemaAttributes>() {
  return function defineSchema<S extends T>(schema: Schema<S>): Schema<S> {
    return schema;
  };
}

/**
 * Schema definer
 * @description A utility to define schemas with type safety.
 */
export const defineSchema = createSchemaDefiner();

/** Schema attributes definer
 * @description A utility to define schema attributes with type safety.
 */
export const defineSchemaAttributes = typeSafeFn<SchemaAttributes>();
