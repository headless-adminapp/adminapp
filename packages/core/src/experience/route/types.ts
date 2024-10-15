import { NavPageItem } from '../app';

export type RouteResolver = (
  item: NavPageItem,
  basePath: string | undefined
) => string;

export type IsRouteActive = (
  path: string,
  item: NavPageItem,
  basePath: string | undefined
) => boolean;

export interface RouteInfo {
  dashboard: string;
  entity: string;
  report: string;
}

export interface RouteExperience {
  basePath: string;
  routeResolver: RouteResolver;
  isRouteActive: IsRouteActive;
}
