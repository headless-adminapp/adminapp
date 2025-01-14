import { useContextSelector } from '@headless-adminapp/app/mutable/context';
import { BoardColumnContext } from '../context';

export function useBoardColumnData() {
  const data = useContextSelector(BoardColumnContext, (state) => state.data);

  return data;
}
