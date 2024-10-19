import { useContextSelector } from '../../mutable/context';
import { GridContext } from '../context';

export function useGridViewLookupData() {
  const viewLookup = useContextSelector(
    GridContext,
    (state) => state.viewLookup
  );
  return viewLookup;
}
