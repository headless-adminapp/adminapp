import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useMaxRecords() {
  return useContextSelector(GridContext, (state) => state.maxRecords);
}
