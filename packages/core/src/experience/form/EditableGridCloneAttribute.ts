import { SchemaAttributes } from '../../schema';

export interface EditableGridCloneAttribute<
  S extends SchemaAttributes = SchemaAttributes
> {
  attributeName: string;
  attributes: (keyof S)[];
}
