import { Icon, IconSet } from './types';

export function resolveIcon<T extends IconSet>(
  name: keyof T | (string & {}),
  iconSet: T
): Icon | undefined {
  return (iconSet as any)[name];
}

export function defineIconSet<T extends IconSet>(iconSet: T): T {
  return iconSet;
}
