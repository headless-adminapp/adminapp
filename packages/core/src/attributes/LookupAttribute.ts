import { Localized } from '../types';
import { AttributeBase } from './AttributeBase';
import { Id, IdTypes } from './IdAttribute';

export type LookupBehavior = 'reference' | 'dependent';

/**
 * Lookup attribute type
 * @description Represents a lookup attribute that references another entity.
 * */
export type LookupAttribute = AttributeBase<Id> & {
  type: 'lookup';
  entity: string;
  behavior?: LookupBehavior;
  relatedLabel?: string;
  localizedRelatedLabel?: Localized<string>;
} & IdTypes;

/**
 * MultiLookup attribute type
 * @description Represents a multi-lookup attribute that references multiple records of another entity.
 * */
export type MultiLookupAttribute = AttributeBase<Id[]> & {
  type: 'lookups';
  entity: string;
  behavior?: LookupBehavior;
  relatedLabel?: string;
  localizedRelatedLabel?: Localized<string>;
} & IdTypes;

/**
 * Regarding attribute type
 * @description Represents a regarding attribute that can reference multiple entity types.
 */
export type RegardingAttribute = AttributeBase<Id> & {
  type: 'regarding';
  localizedRelatedLabel?: Localized<string>;
  entities: string[];
  entityTypeAttribute: string;
} & IdTypes;
