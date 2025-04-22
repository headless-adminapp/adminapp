import { Localized } from '../types';
import { AttributeBase } from './AttributeBase';
import { Id, IdTypes } from './IdAttribute';

export type LookupBehavior = 'reference' | 'dependent';

export type LookupAttribute = AttributeBase<Id> & {
  type: 'lookup';
  entity: string;
  behavior?: LookupBehavior;
  relatedLabel?: string;
  localizedRelatedLabel?: Localized<string>;
} & IdTypes;

export type MultiLookupAttribute = AttributeBase<Id[]> & {
  type: 'lookups';
  entity: string;
  behavior?: LookupBehavior;
  relatedLabel?: string;
  localizedRelatedLabel?: Localized<string>;
} & IdTypes;

export type RegardingAttribute = AttributeBase<Id> & {
  type: 'regarding';
  behavior?: LookupBehavior;
  localizedRelatedLabel?: Localized<string>;
  entities: string[];
  entityTypeAttribute: string;
} & IdTypes;
