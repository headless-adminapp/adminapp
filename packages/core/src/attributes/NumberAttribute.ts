import { AttributeBase } from './AttributeBase';

/**
 * Number attribute type
 * @description Represents a number attribute with various formatting options.
 * */
export type NumberAttribute = AttributeBase<number> & {
  type: 'number';
  format:
    | 'integer'
    | 'decimal'
    | 'duration' // 'duration' is in minutes
    | 'time'; // time of day in minutes
  // number of decimal places for decimal format
  decimalPlaces?: number;
  autoNumber?: boolean;
};
