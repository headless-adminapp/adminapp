import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { GridContext, TransformedViewColumn } from '../context';

export function useGridColumns<
  S extends SchemaAttributes = SchemaAttributes
>(): TransformedViewColumn<S>[] {
  return useContextSelector(
    GridContext,
    (state) => state.columns as TransformedViewColumn<S>[]
  );
}
