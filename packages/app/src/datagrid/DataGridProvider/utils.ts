import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import { Filter } from '@headless-adminapp/core/transport';
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
  columnFilters: Partial<Record<string, ColumnCondition>> | undefined,
  schemaStore: ISchemaStore
): Filter | null {
  const conditions: any[] = [];

  if (filter) {
    conditions.push(filter);
  }

  if (extraFilter) {
    conditions.push(extraFilter);
  }

  if (columnFilters) {
    const transformedColumnFilters = transformColumnFilter(
      columnFilters,
      schema,
      schemaStore
    );

    if (transformedColumnFilters) {
      conditions.push({
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

  if (conditions.length === 0) {
    return null;
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return {
    type: 'and',
    conditions,
  };
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
