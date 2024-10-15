import { AttributeBase } from './AttributeBase';

export type MoneyAttribute = AttributeBase<number> & {
  type: 'money';
};
