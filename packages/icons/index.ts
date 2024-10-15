import { IconPlaceholder } from './IconPlaceholder';
import { iconSetStore } from './store';
import { Icon, IconSet } from './types';
import { resolveIcon } from './utils';

export type { Icon, IconProps, IconResolver } from './types';
export { iconSetStore as Icons } from './store';
export { IconPlaceholder } from './IconPlaceholder';

export function iconResolver<T extends boolean | Icon>(
  name: keyof IconSet | (string & {}),
  placeholder?: T
): T extends true | Icon ? Icon : Icon | undefined {
  const icon = resolveIcon(name, iconSetStore);

  if (icon) {
    return icon;
  }

  if (placeholder === true) {
    return IconPlaceholder;
  }

  if (!placeholder) {
    return undefined as any;
  }

  return placeholder as any;
}
