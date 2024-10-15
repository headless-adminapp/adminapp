import { Attribute } from './Attribute';
import { DataLookup } from './DataLookup';
import { IdTypes, InferredIdType } from './IdAttribute';

export type InferredAttributeType<A extends Attribute> = A extends {
  type: 'id';
}
  ? A extends IdTypes
    ? InferredIdType<A>
    : never
  : A extends { type: 'string' }
  ? string
  : A extends { type: 'number' }
  ? number
  : A extends { type: 'boolean' }
  ? boolean
  : A extends { type: 'date' }
  ? string
  : A extends { type: 'daterange' }
  ? [string, string]
  : A extends { type: 'choice'; options: Array<infer _> }
  ? A['options'][0]['value']
  : A extends { type: 'choices'; options: Array<infer _> }
  ? A['options'][0]['value'][]
  : A extends { type: 'lookup' }
  ? A extends IdTypes
    ? DataLookup<InferredIdType<A>>
    : never
  : A extends { type: 'money' }
  ? number
  : A extends { type: 'attachment' }
  ? string
  : A extends { type: 'mixed' }
  ? unknown
  : never;
