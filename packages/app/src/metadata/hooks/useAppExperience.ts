import { useContextSelector } from '../../mutable/context';
import { MetadataContext } from '../context';

export function useAppExperience() {
  return useContextSelector(MetadataContext, (state) => state.appExperience);
}
