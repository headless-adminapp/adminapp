import { InferredSchemaType, SchemaAttributes } from '../../schema';
import { Filter } from '../../transport';
import { AuthSession } from '../auth';

export interface QuickFilter<S extends SchemaAttributes = SchemaAttributes> {
  attributes: S;
  defaultValues?: Partial<InferredSchemaType<S>>;
  resolver: (
    values: Partial<InferredSchemaType<S>>,
    auth: AuthSession | null
  ) => Filter | null;
}

export function defineQuickFilter<
  S extends SchemaAttributes = SchemaAttributes
>(quickFilter: QuickFilter<S>): QuickFilter<S> {
  return quickFilter;
}
