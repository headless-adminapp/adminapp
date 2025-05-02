import { SchemaAttributes } from '../../schema';
import { Filter, SortOrder } from '../../transport';
import { AllowAsync } from '../../types';
import { Metadata } from '../types';
import { QuickFilter } from './QuickFilter';
import { ViewColumn } from './ViewColumn';

export interface BaseView<S extends SchemaAttributes = SchemaAttributes> {
  filter?: Filter | null;
  defaultSorting?: Array<{
    field: keyof S;
    order: SortOrder;
  }>;
}

export interface View<S extends SchemaAttributes = SchemaAttributes>
  extends Metadata {
  experience: ViewExperience<S>;
}

export interface AsyncView<S extends SchemaAttributes = SchemaAttributes>
  extends Metadata {
  experience: AllowAsync<ViewExperience<S>>;
}

/** @todo PublicViewExperience */
export type ViewExperience<S extends SchemaAttributes = SchemaAttributes> =
  BaseView<S> & {
    grid: GridView<S>;
    card: CardView<S>;
    quickFilter?: QuickFilter;
  };

export type GridView<S extends SchemaAttributes = SchemaAttributes> = {
  columns: ViewColumn<S>[];
};

export type CardViewSecondaryColumn<
  S extends SchemaAttributes = SchemaAttributes
> = {
  name: keyof S;
  expandedKey?: string;
  label?: false | true | string;
  variant?: 'choice' | 'secondary';
};

export type CardView<S extends SchemaAttributes = SchemaAttributes> = {
  primaryColumn: keyof S;
  secondaryColumns?: CardViewSecondaryColumn<S>[];
  showAvatar?: boolean;
  avatarColumn?: keyof S;
  rightColumn?: Array<{
    name: keyof S;
    variant: 'strong' | 'caption' | 'choice';
  }>;
};
