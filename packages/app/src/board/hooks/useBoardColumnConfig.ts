import { useContextSelector } from '@headless-adminapp/app/mutable/context';

import { BoardColumnContext } from '../context';
import { BoardColumnConfig } from '../types';

export function useBoardColumnConfig() {
  return useContextSelector(
    BoardColumnContext,
    (context) => context.config
  ) as unknown as BoardColumnConfig;
}
