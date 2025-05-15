import { useRouter } from '@headless-adminapp/app/route';
import { useEffect } from 'react';

import { NavItemInfo, NavSubItemInfo } from './types';

export function usePrefetch(item: NavItemInfo | NavSubItemInfo) {
  const router = useRouter();
  useEffect(() => {
    if (!item.isExternal) {
      router.prefetch(item.link);
    }
  }, [item.isExternal, item.link, router]);
}
