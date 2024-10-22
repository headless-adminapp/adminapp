import { useContext } from 'react';

import { RouteHelperContext } from '../context';

export function useIsRouteActive() {
  return useContext(RouteHelperContext).isRouteActive;
}
