import { AttributeBase } from './AttributeBase';

/**
 * DateRange attribute type
 * @description Represents a date range attribute with a start and end date.
 * */
export type DateRangeAttribute = Omit<
  AttributeBase<[string, string]>,
  'default'
> & {
  type: 'daterange';
  default?: [string, string];
};
