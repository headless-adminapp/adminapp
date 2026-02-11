import { AttributeBase } from './AttributeBase';

export type { Attribute } from './Attribute';

export type Option<T extends string | number> = {
  label: string;
  value: T;
  color?: string;
};

/**
 * Choice attribute type
 * @description Represents a choice attribute with predefined options.
 */
export type ChoiceAttribute<T extends string | number> = AttributeBase<T> & {
  type: 'choice';
  options: Option<T>[];
} & (
    | {
        // Choice type is string
        string: true;
      }
    | {
        // Choice type is number
        number: true;
      }
  );

/**
 * Choices attribute type
 * @description Represents a choices attribute that can hold multiple selected options.
 */
export type ChoicesAttribute<T extends string | number> = AttributeBase<T[]> & {
  type: 'choices';
  options: Option<T>[];
} & (
    | {
        // Choices type is string
        string: true;
      }
    | {
        // Choices type is number
        number: true;
      }
  );
