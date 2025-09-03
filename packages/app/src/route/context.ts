import { NavPageItem } from '@headless-adminapp/core/experience/app';
import { RouterInstance } from '@headless-adminapp/core/navigation';
import { createContext } from 'react';

import { ReadonlyURLSearchParams } from './types';

export type InternalRouteResolver = (item: NavPageItem) => string;
export type InternalIsRouteActive = (
  path: string,
  item: NavPageItem
) => boolean;

export const RouterContext = createContext<RouterInstance>(null as any);

export const RouterPathnameContext = createContext<string>(null as any);
export const RouterSearchParamsContext = createContext<ReadonlyURLSearchParams>(
  null as any
);
export const RouterBasePathContext = createContext<string>('');

export interface RouteHelperContext {
  routeResolver: InternalRouteResolver;
  isRouteActive: InternalIsRouteActive;
}

export const RouteHelperContext = createContext<RouteHelperContext>(
  null as any
);
