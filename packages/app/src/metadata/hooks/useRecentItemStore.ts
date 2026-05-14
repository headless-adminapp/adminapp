import { useContextSelector } from '../../mutable/context';
import type { IRecentItemStore } from '../../store/RecentItemStore';
import { MetadataContext } from '../context';

export function useRecentItemStore(): IRecentItemStore {
  return useContextSelector(MetadataContext, (state) => state.recentItemStore);
}
