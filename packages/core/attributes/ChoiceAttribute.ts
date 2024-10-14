import { AttributeBase } from './AttributeBase';

export type { Attribute } from './Attribute';

export type Option<T extends string | number> = {
  label: string;
  value: T;
  color?: string;
};

export type ChoiceAttribute<T extends string | number> = AttributeBase<T> & {
  type: 'choice';
  options: Option<T>[];
} & (
    | {
        string: true;
      }
    | {
        number: true;
      }
  );

export type ChoicesAttribute<T extends string | number> = AttributeBase<T[]> & {
  type: 'choices';
  options: Option<T>[];
} & (
    | {
        string: true;
      }
    | {
        number: true;
      }
  );
