import { SchemaAttributes } from '@headless-adminapp/core/schema';

import { useContextSelector } from '../../mutable/context';
import { BoardContext } from '../context';
import { BoardConfig } from '../types';

export function useBoardConfig<
  S extends SchemaAttributes = SchemaAttributes
>() {
  return useContextSelector(
    BoardContext,
    (context) => context.config
  ) as unknown as BoardConfig<S>;
}
