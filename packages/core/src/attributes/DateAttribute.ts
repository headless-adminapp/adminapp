import { AttributeBase } from './AttributeBase';

export type DateAttribute = Omit<AttributeBase<string>, 'default'> & {
  type: 'date';
  format: 'date' | 'datetime';
  default?: (string & {}) | '@now';
};
