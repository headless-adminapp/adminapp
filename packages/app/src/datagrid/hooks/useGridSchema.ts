import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useDataGridSchema<
  S extends SchemaAttributes = SchemaAttributes
>(): Schema<S> {
  return useContextSelector(
    GridContext,
    (state) => state.schema as unknown as Schema<S>
  );
}
