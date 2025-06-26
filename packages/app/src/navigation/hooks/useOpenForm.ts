import { PageType } from '@headless-adminapp/core/experience/app';
import { OpenFormOptions } from '@headless-adminapp/core/experience/command';
import { useCallback } from 'react';

import { useRouter } from '../../route/hooks';
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

      const state: Record<string, unknown> = {};

      if (options.parameters) {
        state.defaultParameters = {
          logicalName: options.logicalName,
          values: options.parameters,
        };
      }

      if (options.recordSetIds) {
        state.navigator = {
          ids: options.recordSetIds,
          visible: false,
          logicalName: options.logicalName,
        };
      }

      if (options.replace) {
        router.replace(path, {
          state: {
            ...router.getState(),
            ...state,
          },
        });
      } else {
        router.push(path, {
          state,
        });
      }
    },
    [routeResolver, router]
  );
}
