import { SchemaAttributes } from '../../schema';

export interface ViewColumn<S extends SchemaAttributes = SchemaAttributes> {
  width?: number;
  maxWidth?: number;
  name: keyof S;
  expandedKey?: string;
  component?: string;
  plainText?: boolean; // Forcing plain text rendering
}

export interface TransformedViewColumn<
  S extends SchemaAttributes = SchemaAttributes
> extends ViewColumn<S> {
  id: string;
  label: string;
}
