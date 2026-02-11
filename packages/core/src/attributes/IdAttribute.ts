import { AttributeBase } from './AttributeBase';

export type Id = string | number;

export type IdTypes =
  | {
      // Id type is string
      string: true;
    }
  | {
      // Id type is number
      number: true;
    }
  | {
      // Id type is MongoDB ObjectId
      objectId: true;
    }
  | {
      // Id type is GUID/UUID
      guid: true;
    };

/**
 * Id attribute type
 * @description Represents an identifier attribute with various ID types.
 */
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
