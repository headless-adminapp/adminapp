import { useContextSelector } from '@headless-adminapp/app/mutable/context';
import { BoardColumnContext, BoardContext } from '../context';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { BoardColumnConfig, BoardConfig } from '../types';

export function useBoardColumnConfig() {
  return useContextSelector(
    BoardColumnContext,
    (context) => context.config
  ) as unknown as BoardColumnConfig;
}
