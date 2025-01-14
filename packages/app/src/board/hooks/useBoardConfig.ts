import { useContextSelector } from '@headless-adminapp/app/mutable/context';
import { BoardContext } from '../context';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { BoardConfig } from '../types';

export function useBoardConfig<
  S extends SchemaAttributes = SchemaAttributes
>() {
  return useContextSelector(
    BoardContext,
    (context) => context.config
  ) as unknown as BoardConfig<S>;
}
