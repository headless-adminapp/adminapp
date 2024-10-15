import { AttributeBase } from './AttributeBase';

export type DateRangeAttribute = Omit<
  AttributeBase<[Date, Date]>,
  'default'
> & {
  type: 'daterange';
  default?: [Date, Date];
};
