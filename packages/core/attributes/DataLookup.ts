import type { Localized } from '../types';
import type { Id } from './IdAttribute';

export interface DataLookup<T extends Id> {
  id: T;
  name: string;
}

/** @todo move to expereince */
export interface LocalizedDataLookup {
  id: string;
  name: string;
  localizedNames?: Localized<string>;
}
