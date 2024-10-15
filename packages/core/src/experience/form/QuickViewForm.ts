import { SchemaAttributes } from '../../schema';

export type QuickViewForm<S extends SchemaAttributes = SchemaAttributes> = {
  attributes: (keyof S)[];
};
