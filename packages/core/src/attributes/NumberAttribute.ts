import { AttributeBase } from './AttributeBase';

export type NumberAttribute = AttributeBase<number> & {
  type: 'number';
  format:
    | 'integer'
    | 'decimal'
    | 'duration' // 'duration' is in minutes
    | 'time'; // time of day in minutes
  decimalPlaces?: number;
  autoNumber?: boolean;
};
