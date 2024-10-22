import { Attribute } from '@headless-adminapp/core/attributes';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { IsRequired, OptionalNullable } from '@headless-adminapp/core/types';

export type Id = number | string;

export type InferredDbAttributeType<A extends Attribute> = A extends {
  type: 'id';
}
  ? Id
  : A extends { type: 'string' }
  ? string
  : A extends { type: 'number' }
  ? number
  : A extends { type: 'boolean' }
  ? boolean
  : A extends { type: 'date' }
  ? Date
  : A extends { type: 'choice'; options: Array<infer _> }
  ? A['options'][0]['value']
  : A extends { type: 'choices'; options: Array<infer _> }
  ? A['options'][0]['value'][]
  : A extends { type: 'lookup' }
  ? Id
  : A extends { type: 'money' }
  ? number
  : A extends { type: 'attachment' }
  ? string
  : A extends { type: 'mixed' }
  ? unknown
  : never;

export type InferredDbSchemaType<S extends SchemaAttributes> =
  OptionalNullable<{
    [K in keyof S]: IsRequired<S[K]> extends true
      ? InferredDbAttributeType<S[K]>
      : InferredDbAttributeType<S[K]> | null | undefined;
  }>;

export type SequelizeRequiredSchemaAttributes = SchemaAttributes;
