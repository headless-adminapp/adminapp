import { AttributeBase } from './AttributeBase';

/**
 * Boolean attribute type
 * @description Represents a boolean attribute with optional labels for true and false values.
 * */
export type BooleanAttribute = AttributeBase<boolean> & {
  type: 'boolean';
  // Optional labels for true value
  trueLabel?: string;
  // Optional labels for false value
  falseLabel?: string;
};
