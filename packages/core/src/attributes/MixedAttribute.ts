import { AttributeBase } from './AttributeBase';

/**
 * Mixed attribute type
 * @description Represents a mixed attribute that can hold any type of value.
 * */
export type MixedAttribute = AttributeBase<unknown> & {
  type: 'mixed';
};
