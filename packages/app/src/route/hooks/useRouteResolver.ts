import { useContext } from 'react';

import { RouteHelperContext } from '../context';

export function useRouteResolver() {
  return useContext(RouteHelperContext).routeResolver;
}
