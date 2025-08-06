import { Attribute } from '../../attributes';
import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { Data } from '../../transport';

export interface ViewColumnProps {
  column: ViewColumn;
  record: Data<InferredSchemaType<SchemaAttributes>>;
  value: unknown;
  attribute: Attribute;
  formattedValue: string;
  width: number;
}

export interface ViewColumn<S extends SchemaAttributes = SchemaAttributes> {
  width?: number;
  maxWidth?: number;
  name: keyof S;
  label?: string;
  expandedKey?: string;
  component?: string | React.ComponentType<ViewColumnProps>; // Component or unique name of component from registry to override default component
  plainText?: boolean; // Forcing plain text rendering
}

export interface TransformedViewColumn<
  S extends SchemaAttributes = SchemaAttributes
> extends ViewColumn<S> {
  id: string;
  label: string;
}
