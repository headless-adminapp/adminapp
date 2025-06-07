import { Attribute } from '@headless-adminapp/core/attributes';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import {
  Condition,
  Filter,
  OperatorKey,
} from '@headless-adminapp/core/transport';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Op, Sequelize } from 'sequelize';

import { SequelizeSchemaStore } from './SequelizeSchemaStore';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

declare module 'dayjs' {
  interface Dayjs {
    toAttributeDate(attribute: Attribute, timezone?: string): string;
  }
}

dayjs.extend((option, dayjsClass) => {
  dayjsClass.prototype.toAttributeDate = function (
    attribute,
    timezone?: string
  ) {
    if (attribute.type === 'date' && attribute.format === 'date') {
      return this.tz(timezone).format('YYYY-MM-DD');
    }

    return this.toISOString();
  };
});

function isSqlite(sequelize: Sequelize) {
  return sequelize.getDialect() === 'sqlite';
}

export function getLikeOperator(sequelize: Sequelize): any {
  return isSqlite(sequelize) ? Op.like : Op.iLike;
}

export function getNotLikeOperator(sequelize: Sequelize): any {
  return isSqlite(sequelize) ? Op.notLike : Op.notILike;
}

function hasTimezoneInfo(dateString: string): boolean {
  return /([Zz]|[+-]\d{2}:?\d{2}|GMT[+-]\d{4})/.test(dateString);
}

function hasTime(dateString: string): boolean {
  return /\d{1,2}:\d{2}(:\d{2})?/.test(dateString);
}

function createDayjs(timezone: string, value?: any) {
  const d = dayjs(value);

  // If value is plain string without timezone
  // we assume it is a local time
  const keepLocalTime = typeof value === 'string' && !hasTimezoneInfo(value);

  return d.tz(timezone, keepLocalTime);
}

function getFiscalYear(date: dayjs.Dayjs) {
  if (date.month() < 3) {
    return date.year() - 1;
  }
  return date.year();
}

function startOfFiscalYear(year: number, tz: string, attribute: Attribute) {
  if (attribute.type === 'date' && attribute.format === 'date') {
    return dayjs(`${year}-04-01`).utc(true).startOf('day');
  }

  return dayjs(`${year}-04-01`).tz(tz, true).startOf('day');
}

interface ConditionTransformerOptions<
  SA extends SchemaAttributes = SchemaAttributes
> {
  timezone: string;
  schemaStore: SequelizeSchemaStore<SA>;
  sequelize: Sequelize;
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
  like: (condition, attribute, options) => ({
    [condition.field]: {
      [getLikeOperator(options.sequelize)]: `%${condition.value}%`,
    },
  }),
  'not-like': (condition, attribute, options) => ({
    [condition.field]: {
      [getNotLikeOperator(options.sequelize)]: `%${condition.value}%`,
    },
  }),
  'begins-with': (condition, attribute, options) => ({
    [condition.field]: {
      [getLikeOperator(options.sequelize)]: `${condition.value}%`,
    },
  }),
  'ends-with': (condition, attribute, options) => ({
    [condition.field]: {
      [getLikeOperator(options.sequelize)]: `%${condition.value}`,
    },
  }),
  'not-begin-with': (condition, attribute, options) => ({
    [condition.field]: {
      [getNotLikeOperator(options.sequelize)]: `${condition.value}%`,
    },
  }),
  'not-end-with': (condition, attribute, options) => ({
    [condition.field]: {
      [getNotLikeOperator(options.sequelize)]: `%${condition.value}`,
    },
  }),

  // date
  on: (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        [Op.gte]: createDayjs(timezone)
          .startOf('day')
          .toAttributeDate(attribute),
        [Op.lt]: createDayjs(timezone)
          .add(1, 'day')
          .startOf('day')
          .toAttributeDate(attribute),
      },
    };
  },
  'on-or-after': (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        [Op.gte]: createDayjs(timezone, condition.value)
          .startOf('day')
          .toAttributeDate(attribute),
      },
    };
  },
  'on-or-before': (condition, attribute, { timezone }) => {
    console.log(
      'on-or-before',
      createDayjs(timezone, condition.value)
        .startOf('day')
        .add(1, 'day')
        .toAttributeDate(attribute),
      createDayjs(timezone, condition.value)
        .startOf('day')
        .add(1, 'day')
        .format('YYYY-MM-DD HH'),
      createDayjs(timezone, condition.value)
        .startOf('day')
        .add(1, 'day')
        .toISOString()
    );
    return {
      [condition.field]: {
        [Op.lt]: createDayjs(timezone, condition.value)
          .startOf('day')
          .add(1, 'day')
          .toAttributeDate(attribute),
      },
    };
  },
  'this-month': (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        [Op.gte]: createDayjs(timezone)
          .startOf('month')
          .toAttributeDate(attribute),
        [Op.lt]: createDayjs(timezone)
          .add(1, 'month')
          .startOf('month')
          .toAttributeDate(attribute),
      },
    };
  },
  today: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  yesterday: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
    },
  }),
  tomorrow: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(2, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'this-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .startOf('isoWeek')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(1, 'week')
        .startOf('isoWeek')
        .toAttributeDate(attribute),
    },
  }),
  'this-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .startOf('year')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(1, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
    },
  }),
  'this-fiscal-year': (condition, attribute, { timezone }) => {
    const fiscalYear = getFiscalYear(createDayjs(timezone));

    return {
      [condition.field]: {
        [Op.gte]: startOfFiscalYear(
          fiscalYear,
          timezone,
          attribute
        ).toAttributeDate(attribute),
        [Op.lt]: startOfFiscalYear(
          fiscalYear + 1,
          timezone,
          attribute
        ).toAttributeDate(attribute),
      },
    };
  },
  'next-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: dayjs()
        .add(1, 'week')
        .tz(timezone)
        .startOf('isoWeek')
        .toAttributeDate(attribute),
      [Op.lt]: dayjs()
        .add(2, 'week')
        .tz(timezone)
        .startOf('isoWeek')
        .toAttributeDate(attribute),
    },
  }),
  'next-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(8, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'next-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .add(1, 'month')
        .startOf('month')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(2, 'month')
        .startOf('month')
        .toAttributeDate(attribute),
    },
  }),
  'next-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .add(1, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(2, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
    },
  }),
  'next-fiscal-year': (condition, attribute, { timezone }) => {
    const fiscalYear = getFiscalYear(createDayjs(timezone)) + 1;
    return {
      [condition.field]: {
        [Op.gte]: startOfFiscalYear(
          fiscalYear,
          timezone,
          attribute
        ).toAttributeDate(attribute),
        [Op.lt]: startOfFiscalYear(
          fiscalYear + 1,
          timezone,
          attribute
        ).toAttributeDate(attribute),
      },
    };
  },
  'next-x-hours': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone).toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(condition.value, 'hour')
        .toAttributeDate(attribute),
    },
  }),
  'next-x-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(condition.value, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'last-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(1, 'week')
        .startOf('isoWeek')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .startOf('isoWeek')
        .toAttributeDate(attribute),
    },
  }),
  'last-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(7, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'last-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(1, 'month')
        .startOf('month')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .startOf('month')
        .toAttributeDate(attribute),
    },
  }),
  'last-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(1, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone).startOf('year').toAttributeDate(attribute),
    },
  }),
  'last-fiscal-year': (condition, attribute, { timezone }) => {
    const fiscalYear = getFiscalYear(createDayjs(timezone)) - 1;

    return {
      [condition.field]: {
        [Op.gte]: startOfFiscalYear(
          fiscalYear,
          timezone,
          attribute
        ).toAttributeDate(attribute),
        [Op.lt]: startOfFiscalYear(
          fiscalYear + 1,
          timezone,
          attribute
        ).toAttributeDate(attribute),
      },
    };
  },
  'last-x-hours': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(condition.value, 'hour')
        .toAttributeDate(attribute, timezone),
      [Op.lt]: createDayjs(timezone).toAttributeDate(attribute, timezone),
    },
  }),
  'last-x-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: createDayjs(timezone)
        .subtract(condition.value, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      [Op.lt]: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'olderthan-x-hours': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.lte]: createDayjs(timezone)
        .subtract(condition.value, 'hour')
        .toAttributeDate(attribute, timezone),
    },
  }),
  'olderthan-x-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.lt]: createDayjs(timezone)
        .subtract(condition.value - 1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'in-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      [Op.gte]: startOfFiscalYear(
        condition.value,
        timezone,
        attribute
      ).toAttributeDate(attribute),
      [Op.lt]: startOfFiscalYear(
        condition.value + 1,
        timezone,
        attribute
      ).toAttributeDate(attribute),
    },
  }),

  // mixed
  eq: (condition, attribute, options) => {
    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          [getLikeOperator(options.sequelize)]: condition.value,
        },
      };
    }

    return {
      [condition.field]: condition.value,
    };
  },
  ne: (condition, attribute, options) => {
    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          [getNotLikeOperator(options.sequelize)]: condition.value,
        },
      };
    }

    return {
      [condition.field]: {
        [Op.ne]: condition.value,
      },
    };
  },
  between: (condition, attribute, { timezone }) => {
    if (attribute.type === 'date') {
      if (attribute.format === 'date') {
        return {
          [condition.field]: {
            [Op.between]: [
              createDayjs(timezone, condition.value[0])
                .startOf('day')
                .toAttributeDate(attribute),
              createDayjs(timezone, condition.value[0])
                .startOf('day')
                .toAttributeDate(attribute),
            ],
          },
        };
      }

      const inputHasTime =
        hasTime(condition.value[0]) || hasTime(condition.value[1]);

      if (!inputHasTime) {
        return {
          [condition.field]: {
            [Op.gte]: createDayjs(timezone, condition.value[0])
              .startOf('day')
              .toAttributeDate(attribute),
            [Op.lt]: createDayjs(timezone, condition.value[1])
              .add(1, 'day')
              .startOf('day')
              .toAttributeDate(attribute),
          },
        };
      }

      return {
        [condition.field]: {
          [Op.between]: [
            createDayjs(timezone, condition.value[0]).toAttributeDate(
              attribute
            ),
            createDayjs(timezone, condition.value[1]).toAttributeDate(
              attribute
            ),
          ],
        },
      };
    }

    if (attribute.type === 'number' || attribute.type === 'money') {
      return {
        [condition.field]: {
          [Op.between]: [condition.value[0], condition.value[1]],
        },
      };
    }

    return null;
  },

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
      throw new Error('Value for "in" operator must be an array');
    }

    if (!condition.value.length) {
      throw new Error('Value for "in" operator cannot be an empty array');
    }

    if (attribute.type === 'boolean') {
      // handle empty value for boolean
      return {
        [Op.or]: condition.value.map((value) => {
          if (typeof value === 'boolean') {
            if (value) {
              return {
                [condition.field]: { [Op.eq]: true },
              };
            } else {
              return {
                [Op.or]: [
                  {
                    [condition.field]: { [Op.eq]: false },
                  },
                  {
                    [condition.field]: { [Op.eq]: null },
                  },
                ],
              };
            }
          } else {
            throw new Error('Invalid value for boolean type');
          }
        }),
      };
    }

    if (
      attribute.type === 'choice' ||
      attribute.type === 'choices' ||
      attribute.type === 'id' ||
      attribute.type === 'lookup' ||
      attribute.type === 'string'
    ) {
      return {
        [condition.field]: {
          [Op.in]: condition.value,
        },
      };
    }

    throw new Error('Invalid type');
  },
  'not-in': (condition, attribute) => {
    if (!Array.isArray(condition.value)) {
      throw new Error('Value for "not-in" operator must be an array');
    }

    if (!condition.value.length) {
      throw new Error('Value for "not-in" operator cannot be an empty array');
    }

    if (attribute.type === 'boolean') {
      return {
        [Op.and]: condition.value.map((value) => {
          if (typeof value === 'boolean') {
            if (value) {
              return {
                [Op.or]: [
                  {
                    [condition.field]: { [Op.eq]: false },
                  },
                  {
                    [condition.field]: { [Op.eq]: null },
                  },
                ],
              };
            } else {
              return {
                [condition.field]: { [Op.eq]: true },
              };
            }
          } else {
            throw new Error('Invalid value for boolean type');
          }
        }),
      };
    }

    if (attribute.type === 'choice' || attribute.type === 'choices') {
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

  if (!attribute) {
    throw new Error(`Attribute not found: ${condition.field}`);
  }

  return transformer(condition, attribute, {
    schemaStore: options.schemaStore as unknown as SequelizeSchemaStore,
    timezone: options.timezone,
    sequelize: options.sequelize,
  });
}

export function transformFilter<SA extends SchemaAttributes>(
  filter: Filter | null | undefined,
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
                schema.collectionName ?? schema.logicalName,
                condition.field,
                lookupSchema.collectionName ?? lookupSchema.logicalName
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
