import { AttributeBase } from './AttributeBase';

export type DateRangeAttribute = Omit<
  AttributeBase<[string, string]>,
  'default'
> & {
  type: 'daterange';
  default?: [string, string];
};
