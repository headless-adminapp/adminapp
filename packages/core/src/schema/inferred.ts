import type { InferredAttributeType } from '../attributes/inferred';
import type { IsRequired, OptionalNullable } from '../types';
import type { SchemaAttributes } from './SchemaAttributes';

export type InferredSchemaType<S extends SchemaAttributes> = OptionalNullable<{
  [K in keyof S]: IsRequired<S[K]> extends true
    ? InferredAttributeType<S[K]>
    : InferredAttributeType<S[K]> | null | undefined;
}>;
