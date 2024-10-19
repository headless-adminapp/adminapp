import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridDataState() {
  const data = useContextSelector(GridContext, (state) => state.dataState);

  return data;
}
