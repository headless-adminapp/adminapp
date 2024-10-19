import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridData() {
  const data = useContextSelector(GridContext, (state) => state.data);

  return data;
}
