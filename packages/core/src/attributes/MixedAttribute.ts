import { AttributeBase } from './AttributeBase';

export type MixedAttribute = AttributeBase<unknown> & {
  type: 'mixed';
};
