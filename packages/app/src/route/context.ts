import { NavPageItem } from '@headless-adminapp/core/experience/app';
import { createContext } from 'react';

import { ReadonlyURLSearchParams } from './types';

export type InternalRouteResolver = (item: NavPageItem) => string;
export type InternalIsRouteActive = (
  path: string,
  item: NavPageItem
) => boolean;

interface NavigateOptions {
  scroll?: boolean;
}
export interface RouterInstance {
  back: () => void;
  forward: () => void;
  push(href: string, options?: NavigateOptions): void;
  replace(href: string, options?: NavigateOptions): void;
  prefetch(href: string): void;
}

export const RouterContext = createContext<RouterInstance>(null as any);

export const RouterPathnameContext = createContext<string>(null as any);
export const RouterSearchParamsContext = createContext<ReadonlyURLSearchParams>(
  null as any
);
export const RouterBasePathContext = createContext<string | undefined>(
  undefined
);

export interface RouteHelperContext {
  routeResolver: InternalRouteResolver;
  isRouteActive: InternalIsRouteActive;
}

export const RouteHelperContext = createContext<RouteHelperContext>(
  null as any
);
