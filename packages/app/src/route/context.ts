import { NavPageItem } from '@headless-adminapp/core/experience/app';
import { createContext } from 'react';

import { ReadonlyURLSearchParams } from './types';

export type InternalRouteResolver = (item: NavPageItem) => string;
export type InternalIsRouteActive = (
  path: string,
  item: NavPageItem
) => boolean;

interface NavigateOptions {
  state?: any;
}
export interface RouterInstance {
  back: () => void;
  forward: () => void;
  push(href: string, options?: NavigateOptions): void;
  replace(href: string, options?: NavigateOptions): void;
  prefetch(href: string): void;
  setState(state: any): void;
  setState(key: string, state: any): void;
  getState<T = any>(): T;
  getState<T = any>(key: string): T | undefined;
}

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
