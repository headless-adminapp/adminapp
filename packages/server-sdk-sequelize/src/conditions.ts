import { Attribute } from '@headless-adminapp/core/attributes';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import {
  Condition,
  Filter,
  OperatorKey,
} from '@headless-adminapp/core/transport';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Op } from 'sequelize';

import { SequelizeSchemaStore } from './SequelizeSchemaStore';

dayjs.extend(utc);
dayjs.extend(timezone);

function startOfFiscalYear(year: number, tz: string) {
  return dayjs
    .tz(tz)
    .startOf('day')
    .set('year', year)
    .set('month', 3)
    .set('date', 1);
}

function endOfFiscalYear(year: number, tz: string) {
  return dayjs
    .tz(tz)
    .set('year', year + 1)
    .set('month', 2)
    .set('date', 31);
}

interface ConditionTransformerOptions<
  SA extends SchemaAttributes = SchemaAttributes
> {
  timezone: string;
  schemaStore: SequelizeSchemaStore<SA>;
}

type ConditionTransformer = (
  condtion: Condition,
  attribute: Attribute,
  options: ConditionTransformerOptions
) => { [key: string]: any } | null;

const conditionTransformers: Record<OperatorKey, ConditionTransformer> = {
  // number
  lt: (condition) => ({
    [condition.field]: {
      [Op.lt]: condition.value,
    },
  }),
  lte: (condition) => ({
    [condition.field]: {
      [Op.lte]: condition.value,
    },
  }),
  gt: (condition) => ({
    [condition.field]: {
      [Op.gt]: condition.value,
    },
  }),
  gte: (condition) => ({
    [condition.field]: {
      [Op.gte]: condition.value,
    },
  }),

  // text
  like: (condition) => ({
    [condition.field]: {
      [Op.iLike]: `%${condition.value}%`,
    },
  }),
  'not-like': (condition) => ({
    [condition.field]: {
      [Op.notILike]: `%${condition.value}%`,
    },
  }),
  'begins-with': (condition) => ({
    [condition.field]: {
      [Op.iLike]: `${condition.value}%`,
    },
  }),
  'ends-with': (condition) => ({
    [condition.field]: {
      [Op.iLike]: `%${condition.value}`,
    },
  }),
  'not-begin-with': (condition) => ({
    [condition.field]: {
      [Op.notILike]: `${condition.value}%`,
    },
  }),
  'not-end-with': (condition) => ({
    [condition.field]: {
      [Op.notILike]: `%${condition.value}`,
    },
  }),

  // date
  on: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs(condition.value).tz(timezone).startOf('day').toDate(),
        dayjs(condition.value).tz(timezone).endOf('day').toDate(),
      ],
    },
  }),
  'on-or-after': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: dayjs(condition.value).tz(timezone).startOf('day').toDate(),
    },
  }),
  'on-or-before': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.lte]: dayjs(condition.value).tz(timezone).endOf('day').toDate(),
    },
  }),
  'this-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().tz(timezone).startOf('month').toDate(),
        dayjs().tz(timezone).endOf('month').toDate(),
      ],
    },
  }),
  today: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().tz(timezone).startOf('day').toDate(),
        dayjs().tz(timezone).endOf('day').toDate(),
      ],
    },
  }),
  yesterday: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().subtract(1, 'day').tz(timezone).startOf('day').toDate(),
        dayjs().subtract(1, 'day').tz(timezone).endOf('day').toDate(),
      ],
    },
  }),
  tomorrow: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().add(1, 'day').tz(timezone).startOf('day').toDate(),
        dayjs().add(1, 'day').tz(timezone).endOf('day').toDate(),
      ],
    },
  }),
  'this-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().tz(timezone).startOf('week').toDate(),
        dayjs().tz(timezone).endOf('week').toDate(),
      ],
    },
  }),
  'this-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().tz(timezone).startOf('year').toDate(),
        dayjs().tz(timezone).endOf('year').toDate(),
      ],
    },
  }),
  'this-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().month() < 3
          ? startOfFiscalYear(dayjs().year(), timezone).toDate()
          : startOfFiscalYear(dayjs().year() + 1, timezone).toDate(),
        dayjs().month() < 3
          ? endOfFiscalYear(dayjs().year(), timezone).toDate()
          : endOfFiscalYear(dayjs().year() + 1, timezone).toDate(),
      ],
    },
  }),
  'next-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().add(1, 'week').tz(timezone).startOf('week').toDate(),
        dayjs().add(1, 'week').tz(timezone).endOf('week').toDate(),
      ],
    },
  }),
  'next-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().tz(timezone).startOf('day').toDate(),
        dayjs().tz(timezone).add(7, 'day').endOf('day').toDate(),
      ],
    },
  }),
  'next-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().add(1, 'month').tz(timezone).startOf('month').toDate(),
        dayjs().add(1, 'month').tz(timezone).endOf('month').toDate(),
      ],
    },
  }),
  'next-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().add(1, 'year').tz(timezone).startOf('year').toDate(),
        dayjs().add(1, 'year').tz(timezone).endOf('year').toDate(),
      ],
    },
  }),
  'next-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().month() < 3
          ? startOfFiscalYear(dayjs().year(), timezone).toDate()
          : startOfFiscalYear(dayjs().year() + 1, timezone).toDate(),
        dayjs().month() < 3
          ? endOfFiscalYear(dayjs().year(), timezone).toDate()
          : endOfFiscalYear(dayjs().year() + 1, timezone).toDate(),
      ],
    },
  }),
  'next-x-hours': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().add(condition.value, 'hour').toDate(),
    },
  }),
  'next-x-days': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().add(condition.value, 'day').toDate(),
    },
  }),
  'next-x-weeks': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().add(condition.value, 'week').toDate(),
    },
  }),
  'next-x-months': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().add(condition.value, 'month').toDate(),
    },
  }),
  'next-x-years': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().add(condition.value, 'year').toDate(),
    },
  }),
  'last-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().subtract(1, 'week').tz(timezone).startOf('week').toDate(),
        dayjs().subtract(1, 'week').tz(timezone).endOf('week').toDate(),
      ],
    },
  }),
  'last-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().subtract(7, 'day').tz(timezone).startOf('day').toDate(),
        dayjs().subtract(1, 'day').tz(timezone).endOf('day').toDate(),
      ],
    },
  }),
  'last-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().subtract(1, 'month').tz(timezone).startOf('month').toDate(),
        dayjs().subtract(1, 'month').tz(timezone).endOf('month').toDate(),
      ],
    },
  }),
  'last-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().subtract(1, 'year').tz(timezone).startOf('year').toDate(),
        dayjs().subtract(1, 'year').tz(timezone).endOf('year').toDate(),
      ],
    },
  }),
  'last-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        dayjs().month() < 3
          ? startOfFiscalYear(dayjs().year() - 1, timezone).toDate()
          : startOfFiscalYear(dayjs().year() - 2, timezone).toDate(),
        dayjs().month() < 3
          ? endOfFiscalYear(dayjs().year() - 1, timezone).toDate()
          : endOfFiscalYear(dayjs().year() - 2, timezone).toDate(),
      ],
    },
  }),
  'last-x-hours': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().subtract(condition.value, 'hour').toDate(),
    },
  }),
  'last-x-days': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().subtract(condition.value, 'day').toDate(),
    },
  }),
  'last-x-weeks': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().subtract(condition.value, 'week').toDate(),
    },
  }),
  'last-x-months': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().subtract(condition.value, 'month').toDate(),
    },
  }),
  'last-x-years': (condition) => ({
    [condition.field]: {
      [Op.gte]: dayjs().subtract(condition.value, 'year').toDate(),
    },
  }),
  'olderthan-x-hours': (condition) => ({
    [condition.field]: {
      [Op.lte]: dayjs().subtract(condition.value, 'hour').toDate(),
    },
  }),
  'olderthan-x-days': (condition) => ({
    [condition.field]: {
      [Op.lte]: dayjs().subtract(condition.value, 'day').toDate(),
    },
  }),
  'olderthan-x-weeks': (condition) => ({
    [condition.field]: {
      [Op.lte]: dayjs().subtract(condition.value, 'week').toDate(),
    },
  }),
  'olderthan-x-months': (condition) => ({
    [condition.field]: {
      [Op.lte]: dayjs().subtract(condition.value, 'month').toDate(),
    },
  }),
  'olderthan-x-years': (condition) => ({
    [condition.field]: {
      [Op.lte]: dayjs().subtract(condition.value, 'year').toDate(),
    },
  }),
  'in-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.between]: [
        startOfFiscalYear(condition.value, timezone),
        endOfFiscalYear(condition.value, timezone),
      ],
    },
  }),

  // mixed
  eq: (condition, attribute) => {
    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          [Op.iLike]: condition.value,
        },
      };
    }

    if (attribute.type === 'lookup') {
      return {
        [condition.field]: condition.value,
      };
    }

    return {
      [condition.field]: {
        [Op.eq]: condition.value,
      },
    };
  },
  ne: (condition, attribute) => {
    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          [Op.notILike]: condition.value,
        },
      };
    }

    return {
      [condition.field]: {
        [Op.ne]: condition.value,
      },
    };
  },
  between: (condition) => ({
    [condition.field]: {
      [Op.between]: [condition.value[0], condition.value[1]],
    },
  }),

  'not-null': (condition) => {
    return {
      [condition.field]: {
        [Op.ne]: null,
      },
    };
  },
  null: (condition) => {
    return {
      [condition.field]: {
        [Op.eq]: null,
      },
    };
  },
  in: (condition, attribute) => {
    if (!Array.isArray(condition.value)) {
      throw new Error('Invalid value');
    }

    if (
      attribute.type === 'boolean' ||
      attribute.type === 'choice' ||
      attribute.type === 'choices'
    ) {
      return {
        [condition.field]: {
          [Op.in]: condition.value,
        },
      };
    }

    if (attribute.type === 'id') {
      return {
        [condition.field]: {
          [Op.in]: condition.value,
        },
      };
    }

    if (attribute.type === 'lookup') {
      return {
        [condition.field]: {
          [Op.in]: condition.value,
        },
      };
    }

    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          $in: condition.value,
        },
      };
    }

    throw new Error('Invalid type');
  },
  'not-in': (condition, attribute) => {
    if (!Array.isArray(condition.value)) {
      throw new Error('Invalid value');
    }

    if (
      attribute.type === 'boolean' ||
      attribute.type === 'choice' ||
      attribute.type === 'choices'
    ) {
      return {
        [condition.field]: {
          [Op.notIn]: condition.value,
        },
      };
    }

    if (attribute.type === 'id') {
      return {
        [condition.field]: {
          [Op.notIn]: condition.value,
        },
      };
    }

    if (attribute.type === 'lookup') {
      return {
        [condition.field]: {
          [Op.notIn]: condition.value,
        },
      };
    }

    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          [Op.notIn]: condition.value,
        },
      };
    }

    throw new Error('Invalid type');
  },
};

export function transformCondition<
  SA extends SchemaAttributes = SchemaAttributes
>(
  condition: Condition,
  attribute: Attribute,
  options: ConditionTransformerOptions<SA>
): { [key: string]: any } | null {
  const transformer = conditionTransformers[condition.operator];

  if (!transformer) {
    return null;
  }

  return transformer(condition, attribute, {
    schemaStore: options.schemaStore as unknown as SequelizeSchemaStore,
    timezone: options.timezone,
  });
}

export function transformFilter<SA extends SchemaAttributes>(
  filter: Filter | null,
  schema: Schema<SA>,
  options: ConditionTransformerOptions<SA>
) {
  if (!filter) {
    return null;
  }

  const { schemaStore } = options;

  const items: unknown[] = [];
  if (filter.conditions?.length) {
    const conditions = filter.conditions
      .map((condition) => {
        const _attribute = schema.attributes[condition.field];

        if (!_attribute) {
          throw new Error(`Invalid field: ${condition.field}`);
        }

        if (condition.extendedKey) {
          if (_attribute.type !== 'lookup') {
            throw new Error(
              `Invalid column filter key: ${condition.field}. Key ${condition.field} is not a lookup column.`
            );
          }

          const lookupSchema = schemaStore.getSchema(_attribute.entity);

          return transformCondition(
            {
              field: `$${schemaStore.getRelationAlias(
                schema.logicalName,
                condition.field,
                _attribute.entity
              )}.${condition.extendedKey as string}$`,
              operator: condition.operator,
              value: condition.value,
            },
            lookupSchema.attributes[condition.extendedKey],
            options
          );
        }

        return transformCondition(
          condition,
          schema.attributes[condition.field],
          options
        );
      })
      .filter(Boolean);

    items.push(...conditions);
  }

  if (filter.filters?.length) {
    const filters = filter.filters
      .map((filter) => transformFilter(filter, schema, options))
      .filter(Boolean);

    items.push(...filters);
  }

  if (!items.length) {
    return null;
  }

  return {
    [filter.type === 'or' ? Op.or : Op.and]: items,
  };
}
