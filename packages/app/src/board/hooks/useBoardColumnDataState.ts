import { useContextSelector } from '@headless-adminapp/app/mutable/context';
import { BoardColumnContext } from '../context';

export function useBoardColumnDataState() {
  const data = useContextSelector(
    BoardColumnContext,
    (state) => state.dataState
  );

  return data;
}
