import {
  CardView,
  ColumnCondition,
} from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { Condition, Filter } from '@headless-adminapp/core/transport';
import dayjs from 'dayjs';

import { TransformedViewColumn } from '../context';

export function transformColumnFilter<
  S extends SchemaAttributes = SchemaAttributes
>(
  filter: Partial<Record<string, ColumnCondition>>,
  schema: Schema<S>,
  schemaStore: ISchemaStore
) {
  const transformedResult = Object.entries(filter).reduce(
    (acc, [id, value]) => {
      const [key, extendedKey] = id.split('.');
      let attribute = schema.attributes[key];

      if (!attribute) {
        return acc;
      }

      if (extendedKey) {
        if (attribute.type !== 'lookup') {
          throw new Error(
            `Invalid column filter key: ${id}. Key ${key} is not a lookup column.`
          );
        }

        const lookupSchema = schemaStore.getSchema(attribute.entity);
        attribute = lookupSchema.attributes[extendedKey];
      }

      if (!attribute) {
        return acc;
      }

      if (value) {
        let transformedValue: any = undefined;

        switch (value.operator) {
          case 'eq':
          case 'ne':
          case 'begins-with':
          case 'not-begin-with':
          case 'like':
          case 'not-like':
          case 'ends-with':
          case 'not-end-with':
          case 'gt':
          case 'gte':
          case 'lt':
          case 'lte':
          case 'last-x-days':
          case 'last-x-hours':
            transformedValue = value.value[0];
            break;
          case 'on':
          case 'on-or-after':
          case 'on-or-before':
            transformedValue = dayjs(value.value[0]).format('YYYY-MM-DD');
            break;
          case 'in':
          case 'not-in':
            if (attribute.type === 'lookup') {
              transformedValue = value.value[0].map((x: any) => x.id);
            } else {
              transformedValue = value.value[0];
            }
            break;
          case 'between':
            transformedValue = value.value;
            break;
        }

        acc[key] = {
          operator: value.operator,
          value: transformedValue,
          extendedKey,
        };
      }

      return acc;
    },
    {} as Record<string, ColumnCondition>
  );

  if (Object.keys(transformedResult).length === 0) {
    return null;
  }

  return transformedResult;
}

export function mergeConditions<S extends SchemaAttributes = SchemaAttributes>(
  schema: Schema<S>,
  filter: Filter | null | undefined,
  extraFilter: Filter | null | undefined,
  quickFilterResults: Filter | null | undefined,
  columnFilters: Partial<Record<string, ColumnCondition>> | undefined,
  schemaStore: ISchemaStore
): Filter | null {
  const filters: any[] = [];

  if (filter) {
    filters.push(filter);
  }

  if (extraFilter) {
    filters.push(extraFilter);
  }

  if (quickFilterResults) {
    filters.push(quickFilterResults);
  }

  if (columnFilters) {
    const transformedColumnFilters = transformColumnFilter(
      columnFilters,
      schema,
      schemaStore
    );

    if (transformedColumnFilters) {
      filters.push({
        type: 'and',
        conditions: Object.entries(transformedColumnFilters).map(
          ([field, condition]) => {
            return {
              field,
              operator: condition!.operator,
              value: condition!.value,
              extendedKey: condition!.extendedKey,
            };
          }
        ),
      });
    }
  }

  if (filters.length === 0) {
    return null;
  }

  if (filters.length === 1) {
    return simplyfyFilter(filters[0]);
  }

  return simplyfyFilter({
    type: 'and',
    filters: filters as [Filter, ...Filter[]],
  });
}

export function mergeFilters(
  ...filters: Array<Filter | null | undefined>
): Filter | null {
  if (filters.length === 0) {
    return null;
  }

  const nonNullFilters = filters.filter((f) => !!f);

  if (nonNullFilters.length === 0) {
    return null;
  }

  if (nonNullFilters.length === 1) {
    return nonNullFilters[0];
  }

  return {
    type: 'and',
    filters: nonNullFilters as [Filter, ...Filter[]],
  };
}

export function simplyfyFilter(filter: Filter): Filter | null {
  const conditions: Condition<any>[] = filter.conditions ?? [];
  const filters: Filter[] = [];

  if (filter.filters) {
    for (const f of filter.filters) {
      const _f = simplyfyFilter(f);

      if (!_f) {
        continue;
      }

      if (_f.type !== filter.type) {
        filters.push(_f);
      } else {
        if (_f.conditions) {
          conditions.push(..._f.conditions);
        }
        if (_f.filters) {
          filters.push(..._f.filters);
        }
      }
    }
  }

  if (conditions.length === 0 && filters.length === 0) {
    return null;
  }

  return {
    type: filter.type,
    conditions: conditions,
    filters: filters,
  } as Filter<any>;
}

export function collectExpandedKeys(
  columns: TransformedViewColumn<SchemaAttributes>[]
) {
  return columns
    .filter((x) => x.expandedKey)
    .reduce((acc, x) => {
      if (!acc[x.name]) {
        acc[x.name] = [];
      }

      if (!acc[x.name].includes(x.expandedKey!)) {
        acc[x.name].push(x.expandedKey!);
      }
      return acc;
    }, {} as Record<string, string[]>);
}

export function collectGridColumns<
  S extends SchemaAttributes = SchemaAttributes
>({
  gridColumns,
  schema,
}: {
  gridColumns: TransformedViewColumn<S>[];
  schema: Schema<S>;
}) {
  const set = new Set([
    ...gridColumns.filter((x) => !x.expandedKey).map((x) => x.name),
    schema.primaryAttribute,
  ]);

  if (schema.avatarAttribute) {
    set.add(schema.avatarAttribute);
  }

  return Array.from(set);
}

export function collectCardColumns<
  S extends SchemaAttributes = SchemaAttributes
>({
  cardView,
  schema,
}: {
  cardView: CardView<S>;
  schema: Schema<S>;
}): string[] {
  const set = new Set([
    cardView.primaryColumn,
    ...(cardView.secondaryColumns
      ?.filter((x) => !x.expandedKey)
      .map((x) => x.name) ?? []),
    ...(cardView.rightColumn?.map((x) => x.name) ?? []),
    schema.primaryAttribute,
  ]);

  if (
    cardView.showAvatar &&
    (cardView.avatarColumn || schema.avatarAttribute)
  ) {
    set.add((cardView.avatarColumn ?? schema.avatarAttribute) as string);
  }

  return Array.from(set) as string[];
}

export function collectCardExpandedKeys<
  S extends SchemaAttributes = SchemaAttributes
>({ cardView }: { cardView: CardView<S> }) {
  return cardView.secondaryColumns
    ?.filter((x) => x.expandedKey)
    .reduce((acc, x) => {
      const name = x.name as string;
      if (!acc[name]) {
        acc[name] = [];
      }

      if (!acc[name].includes(x.expandedKey!)) {
        acc[name].push(x.expandedKey!);
      }
      return acc;
    }, {} as Record<string, string[]>);
}
