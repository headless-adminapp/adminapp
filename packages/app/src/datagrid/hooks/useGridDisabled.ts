import { useContextSelector } from '../../mutable';
import { GridContext } from '../context';

export function useGridDisabled() {
  return useContextSelector(GridContext, (state) => state.disabled);
}
