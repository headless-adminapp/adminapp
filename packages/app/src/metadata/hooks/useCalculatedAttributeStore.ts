import { useContextSelector } from '../../mutable/context';
import { MetadataContext } from '../context';

export function useCalculatedAttributeStore() {
  return useContextSelector(
    MetadataContext,
    (state) => state.calculatedAttributeStore
  );
}
