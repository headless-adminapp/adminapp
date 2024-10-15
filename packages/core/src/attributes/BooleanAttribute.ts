import { AttributeBase } from './AttributeBase';

export type BooleanAttribute = AttributeBase<boolean> & {
  type: 'boolean';
  trueLabel: string;
  falseLabel: string;
};
