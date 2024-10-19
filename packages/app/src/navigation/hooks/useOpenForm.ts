import {
  PageEntiyForm,
  PageType,
} from '@headless-adminapp/core/experience/app';
import { useCallback } from 'react';

import { useRouter } from '../../route/hooks/';
import { useRouteResolver } from '../../route/hooks/useRouteResolver';

export function useOpenForm() {
  const routeResolver = useRouteResolver();
  const router = useRouter();

  return useCallback(
    (
      formOptions: Omit<PageEntiyForm, 'type'>,
      navigationOptions: {
        replace?: boolean;
      }
    ) => {
      const path = routeResolver({
        type: PageType.EntityForm,
        ...formOptions,
      });

      if (navigationOptions.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [routeResolver, router]
  );
}
