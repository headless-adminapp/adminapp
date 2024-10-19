import { useContextSelector } from '../../mutable/context';
import { MetadataContext } from '../context';

export function useExperienceStore() {
  return useContextSelector(MetadataContext, (state) => state.experienceStore);
}
