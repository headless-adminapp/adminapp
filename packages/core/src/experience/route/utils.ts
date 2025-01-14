import { PageType } from '../app';
import { IsRouteActive, RouteInfo, RouteResolver } from './types';

export const defaultRouteInfo: RouteInfo = {
  dashboard: 'dashboard',
  entity: 'data',
  report: 'reports',
};

export function createRouteResolver(routeInfo: RouteInfo): RouteResolver {
  const routeResolver: RouteResolver = (item, basePath) => {
    basePath = basePath || '';

    switch (item.type) {
      case PageType.Dashboard:
        return item.dashboardId
          ? `${basePath}/${routeInfo.dashboard}?id=${item.dashboardId}`
          : `${basePath}/${routeInfo.dashboard}`;
      case PageType.EntityView:
        if (item.viewId) {
          return `${basePath}/${routeInfo.entity}/${item.logicalName}?viewId=${item.viewId}`;
        }
        return `${basePath}/${routeInfo.entity}/${item.logicalName}`;
      case PageType.EntityForm: {
        const id = item.id ?? 'new';
        if (item.formId) {
          return `${basePath}/${routeInfo.entity}/${item.logicalName}/${id}?formId=${item.formId}`;
        }
        return `${basePath}/${routeInfo.entity}/${item.logicalName}/${id}`;
      }
      case PageType.Report:
        return `${basePath}/${routeInfo.report}/${item.reportId}`;
      case PageType.Custom:
        if (item.noBasePrefix) {
          return item.link;
        }

        if (item.link.startsWith('http')) {
          return item.link;
        }

        if (item.link.startsWith('/')) {
          return `${basePath}${item.link}`;
        }

        return `${basePath}/${item.link}`;
      case PageType.External:
        return item.link;
      default:
        throw new Error(`Unknown page type: ${item}`);
    }
  };

  return routeResolver;
}

export function createIsRouteActive(routeInfo: RouteInfo): IsRouteActive {
  const isRouteActive: IsRouteActive = (path, item, basePath) => {
    basePath = basePath || '';

    switch (item.type) {
      case PageType.Dashboard:
        return path === `${basePath}/${routeInfo.dashboard}`;
      case PageType.EntityForm:
        return (
          path ===
          `${basePath}/${routeInfo.entity}/${item.logicalName}/${item.id}`
        );
      case PageType.EntityView:
        return path.startsWith(
          `${basePath}/${routeInfo.entity}/${item.logicalName}`
        );
      case PageType.Report:
        return path === `${basePath}/${routeInfo.report}/${item.reportId}`;
      case PageType.Custom:
        if (item.noBasePrefix) {
          return path === item.link;
        }

        let link = item.link;

        if (!link.startsWith('/')) {
          link = `/${link}`;
        }

        return path === `${basePath}${link}`;
      case PageType.External:
        return path === item.link;
      default:
        return false;
    }

    return false;
  };

  return isRouteActive;
}
