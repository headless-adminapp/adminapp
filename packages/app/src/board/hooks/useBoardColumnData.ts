import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { BoardColumnContext, BoardColumnContextState } from '../context';

export function useBoardColumnData<
  S extends SchemaAttributes = SchemaAttributes
>(): BoardColumnContextState<S>['data'] {
  const data = useContextSelector(BoardColumnContext, (state) => state.data);

  return data as BoardColumnContextState<S>['data'];
}
