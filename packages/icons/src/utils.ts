import { IconPlaceholder } from './IconPlaceholder';
import { Icon, IconSet } from './types';

export function resolveIcon<T extends IconSet>(
  name: keyof T | {},
  iconSet: T
): Icon | undefined {
  return (iconSet as any)[name];
}

export function defineIconSet<T extends IconSet>(iconSet: T): T {
  return proxyIconSet(iconSet);
}

export function proxyIconSet<T extends IconSet>(iconSet: T): T {
  const handler = {
    get(target: T, name: string) {
      return resolveIcon(name, target) ?? IconPlaceholder;
    },
  };
  return new Proxy(iconSet, handler);
}
