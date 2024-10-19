import { ColumnCondition } from '@headless-adminapp/core/experience/view';
import { Schema } from '@headless-adminapp/core/schema';
import dayjs from 'dayjs';

export function transformColumnFilter(
  filter: Partial<Record<string, ColumnCondition>>,
  schema: Schema,
  getSchema: (logicalName: string) => Schema
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

        const lookupSchema = getSchema(attribute.entity);
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
