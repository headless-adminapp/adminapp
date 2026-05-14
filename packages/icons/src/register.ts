import { iconSetStore } from './store';
import type { IconSet } from './types';

export function registerIconSet<T extends IconSet>(iconSet: Partial<T>) {
  Object.assign(iconSetStore, iconSet);
}
