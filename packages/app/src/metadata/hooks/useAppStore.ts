import { useContextSelector } from '../../mutable/context';
import { MetadataContext } from '../context';

export function useAppStore() {
  return useContextSelector(MetadataContext, (state) => state.appStore);
}
