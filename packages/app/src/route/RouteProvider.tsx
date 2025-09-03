import {
  createIsRouteActive,
  createRouteResolver,
  defaultRouteInfo,
  IsRouteActive,
  RouteResolver,
} from '@headless-adminapp/core/experience/route';
import { RouterInstance } from '@headless-adminapp/core/navigation';
import { FC, PropsWithChildren, useCallback, useMemo, useRef } from 'react';

import {
  InternalIsRouteActive,
  InternalRouteResolver,
  RouteHelperContext,
  RouterBasePathContext,
  RouterContext,
  RouterPathnameContext,
  RouterSearchParamsContext,
} from './context';
import { ReadonlyURLSearchParams } from './types';

const defaultRouteResolver = createRouteResolver(defaultRouteInfo);
const defaultIsRouteActive = createIsRouteActive(defaultRouteInfo);

export interface RouteProviderProps {
  router: RouterInstance;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  basePath?: string;
  routeResolver?: RouteResolver;
  isRouteActive?: IsRouteActive;
}

export const RouteProvider: FC<PropsWithChildren<RouteProviderProps>> = ({
  children,
  pathname,
  router,
  searchParams,
  basePath = '',
  routeResolver = defaultRouteResolver,
  isRouteActive = defaultIsRouteActive,
}) => {
  const basePathRef = useRef(basePath);
  basePathRef.current = basePath;

  const routeResolverRef = useRef(routeResolver);
  routeResolverRef.current = routeResolver;

  const isRouteActiveRef = useRef(isRouteActive);
  isRouteActiveRef.current = isRouteActive;

  const internalRouteResolver: InternalRouteResolver = useCallback(
    (item) => routeResolverRef.current(item, basePathRef.current),
    []
  );

  const internalIsRouteActive: InternalIsRouteActive = useCallback(
    (path, item) => isRouteActiveRef.current(path, item, basePathRef.current),
    []
  );

  const routeHelperContextState = useMemo(() => {
    return {
      routeResolver: internalRouteResolver,
      isRouteActive: internalIsRouteActive,
    };
  }, [internalRouteResolver, internalIsRouteActive]);

  return (
    <RouterContext.Provider value={router}>
      <RouterPathnameContext.Provider value={pathname}>
        <RouterSearchParamsContext.Provider value={searchParams}>
          <RouterBasePathContext.Provider value={basePath}>
            <RouteHelperContext.Provider value={routeHelperContextState}>
              {children}
            </RouteHelperContext.Provider>
          </RouterBasePathContext.Provider>
        </RouterSearchParamsContext.Provider>
      </RouterPathnameContext.Provider>
    </RouterContext.Provider>
  );
};
