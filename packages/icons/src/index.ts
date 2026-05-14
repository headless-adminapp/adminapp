import { IconPlaceholder } from './IconPlaceholder';
import { iconSetStore } from './store';
import type { Icon, IconSet } from './types';
import { resolveIcon } from './utils';

export type { Icon, IconProps, IconResolver } from './types';
export { iconSetStore as Icons } from './store';
export { IconPlaceholder } from './IconPlaceholder';

type IconResolverReturnType<T> = T extends true | Icon
  ? Icon
  : Icon | undefined;

export function iconResolver<T extends boolean | Icon>(
  name: keyof IconSet | {},
  placeholder?: T,
): IconResolverReturnType<T> {
  const icon = resolveIcon(name, iconSetStore);

  if (icon) {
    return icon;
  }

  if (placeholder === true) {
    return IconPlaceholder;
  }

  if (!placeholder) {
    return undefined as IconResolverReturnType<T>;
  }

  return placeholder as Icon;
}
