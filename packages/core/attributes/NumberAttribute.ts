import { AttributeBase } from './AttributeBase';

export type NumberAttribute = AttributeBase<number> & {
  type: 'number';
  format: 'integer' | 'decimal';
  autoNumber?: boolean;
};
