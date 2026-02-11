import { AttributeBase } from './AttributeBase';

/**
 * Date attribute type
 * @description Represents a date attribute with different formatting options.
 * */
export type DateAttribute = Omit<AttributeBase<string>, 'default'> & {
  type: 'date';
  format:
    | 'date' // date only
    | 'datetime'; // date and time
  default?: (string & {}) | '@now'; // default can be a date string or the special value '@now'
};
