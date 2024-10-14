import { AttributeBase } from './AttributeBase';

export type Id = string | number;

export type IdTypes =
  | {
      string: true;
    }
  | {
      number: true;
    }
  | {
      objectId: true;
    }
  | {
      guid: true;
    };

export type IdAttribute<T extends Id> = AttributeBase<T> & {
  type: 'id';
} & IdTypes;

export type InferredIdType<A extends IdTypes> = A extends {
  guid: true;
}
  ? string
  : A extends {
      objectId: true;
    }
  ? string
  : A extends {
      string: true;
    }
  ? string
  : A extends {
      number: true;
    }
  ? number
  : never;
