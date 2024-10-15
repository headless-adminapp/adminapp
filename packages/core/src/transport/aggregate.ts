import { Condition } from './Condition';
import { Filter } from './Filter';
import { SortOrder } from './SortOrder';

export enum AggregateType {
  Sum = 'sum',
  Count = 'count',
  Average = 'average',
  Min = 'min',
  Max = 'max',
}

export enum AggregateAttributeFunction {
  Weekday = 'week_day',
  YearMonth = 'year_month',
  Date = 'date',
}

export type AggregateAttributeValue =
  | {
      type: 'column';
      value: string;
      expandedKey?: string;
    }
  | {
      type: 'constant';
      value: string | number;
    }
  | {
      type: 'if-else';
      value: {
        condition: Condition;
        then: AggregateAttributeValue;
        else: AggregateAttributeValue;
      };
    }
  | {
      type: 'function';
      value: AggregateAttributeFunction;
      params: AggregateAttributeValue[];
    };

export type AggregateAttribute = {
  aggregate: AggregateType | false;
  type: 'number' | 'string' | 'date';
  format?: string;
  value: AggregateAttributeValue;
};

export interface AggregateQuery<
  A extends Record<string, AggregateAttribute> = Record<
    string,
    AggregateAttribute
  >
> {
  logicalName: string;
  attributes: A;
  orders?: Array<{ field: keyof A; order: SortOrder }>;
  limit?: number;
  filter?: Filter;
  reverse?: boolean;
}

export function defineAggregateQuery<
  A extends Record<string, AggregateAttribute>
>(query: AggregateQuery<A>): AggregateQuery<A> {
  return query;
}

export type InferredAggregateAttributeType<A extends AggregateAttribute> =
  A extends { type: 'string' }
    ? string
    : A extends { type: 'number' }
    ? number
    : A extends { type: 'date' }
    ? string
    : never;

export type InferredTransformedAggregateAttributeType<
  A extends AggregateAttribute
> = A extends { type: 'string' }
  ? string
  : A extends { type: 'number' }
  ? number
  : A extends { type: 'date' }
  ? number
  : never;

export type InferredAggregateQueryResult<
  A extends Record<string, AggregateAttribute>
> = {
  [K in keyof A]: InferredAggregateAttributeType<A[K]>;
};

export type InferredTransformedAggregateQueryResult<
  A extends Record<string, AggregateAttribute>
> = {
  [K in keyof A]: InferredTransformedAggregateAttributeType<A[K]>;
};
