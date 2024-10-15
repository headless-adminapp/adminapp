import { AttributeBase } from './AttributeBase';

export type DateAttribute = Omit<AttributeBase<Date>, 'default'> & {
  type: 'date';
  format: 'date' | 'datetime';
  default?: Date | '@now';
};
