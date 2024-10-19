import { View } from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useSelectedView<
  S extends SchemaAttributes = SchemaAttributes
>(): View<S> {
  return useContextSelector(
    GridContext,
    (state) => state.view as unknown as View<S>
  );
}
