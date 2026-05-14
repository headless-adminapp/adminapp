import type { NavPageItem } from '@headless-adminapp/core/experience/app';
import type { RouterInstance } from '@headless-adminapp/core/navigation';
import { createContext } from 'react';

import type { ReadonlyURLSearchParams } from './types';

export type InternalRouteResolver = (item: NavPageItem) => string;
export type InternalIsRouteActive = (
  path: string,
  item: NavPageItem,
) => boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouterContext = createContext<RouterInstance>(null as any);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RouterPathnameContext = createContext<string>(null as any);
export const RouterSearchParamsContext = createContext<ReadonlyURLSearchParams>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any,
);
export const RouterBasePathContext = createContext<string>('');

export interface RouteHelperContext {
  routeResolver: InternalRouteResolver;
  isRouteActive: InternalIsRouteActive;
}

export const RouteHelperContext = createContext<RouteHelperContext>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  null as any,
);
