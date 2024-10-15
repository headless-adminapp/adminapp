import { InferredAttributeType } from '../attributes/inferred';
import { IsRequired, OptionalNullable } from '../types';
import { SchemaAttributes } from './SchemaAttributes';

export type InferredSchemaType<S extends SchemaAttributes> = OptionalNullable<{
  [K in keyof S]: IsRequired<S[K]> extends true
    ? InferredAttributeType<S[K]>
    : InferredAttributeType<S[K]> | null | undefined;
}>;
