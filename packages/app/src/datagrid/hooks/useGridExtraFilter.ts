import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridExtraFilter() {
  return useContextSelector(GridContext, (state) => state.extraFilter);
}
