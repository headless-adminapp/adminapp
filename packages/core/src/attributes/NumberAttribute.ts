import { AttributeBase } from './AttributeBase';

export type NumberAttribute = AttributeBase<number> & {
  type: 'number';
  format: 'integer' | 'decimal' | 'duration';
  decimalPlaces?: number;
  autoNumber?: boolean;
};
