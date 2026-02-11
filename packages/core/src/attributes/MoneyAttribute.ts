import { AttributeBase } from './AttributeBase';

/**
 * Money attribute type
 * @description Represents a money attribute.
 * */
export type MoneyAttribute = AttributeBase<number> & {
  type: 'money';
};
