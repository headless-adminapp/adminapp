import { PageType } from '@headless-adminapp/core/experience/app';
import { OpenFormOptions } from '@headless-adminapp/core/experience/command';
import { useCallback } from 'react';

import { useRouter } from '../../route/hooks/';
import { useRouteResolver } from '../../route/hooks/useRouteResolver';

export function useOpenForm() {
  const routeResolver = useRouteResolver();
  const router = useRouter();

  return useCallback(
    (options: OpenFormOptions) => {
      const path = routeResolver({
        logicalName: options.logicalName,
        type: PageType.EntityForm,
        id: options.id,
      });

      if (options.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [routeResolver, router]
  );
}
