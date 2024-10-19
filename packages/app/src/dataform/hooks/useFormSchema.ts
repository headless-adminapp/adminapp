import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { DataFormContext } from '../context';

export function useDataFormSchema<
  S extends SchemaAttributes = SchemaAttributes
>(): Schema<S> {
  return useContextSelector(
    DataFormContext,
    (state) => state.schema as unknown as Schema<S>
  );
}
