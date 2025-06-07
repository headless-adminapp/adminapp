import { Attribute } from '@headless-adminapp/core/attributes';
import { Schema } from '@headless-adminapp/core/schema';
import {
  Condition,
  Filter,
  OperatorKey,
} from '@headless-adminapp/core/transport';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { FilterQuery, Types } from 'mongoose';

import { MongoRequiredSchemaAttributes } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isoWeek);

// Definations

// last-x-hours (current time - x hours to current time) (based on time)
// last-x-days (current date (start of day) - x days to current date (end of day)) (based on date only)

// olderthan-x-hours (current time - x hours) (based on time)
// olderthan-x-days (current date (end of day) - x days) (based on date only)

declare module 'dayjs' {
  interface Dayjs {
    toAttributeDate(attribute: Attribute): Date;
  }
}

dayjs.extend((option, dayjsClass) => {
  dayjsClass.prototype.toAttributeDate = function (attribute) {
    if (attribute.type === 'date' && attribute.format === 'date') {
      return this.utc(true).toDate();
    }

    return this.toDate();
  };
});

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

interface ConditionTransformerOptions {
  timezone: string;
}

type ConditionTransformer = (
  condtion: Condition,
  attribute: Attribute,
  options: ConditionTransformerOptions
) => { [key: string]: any } | null;

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

const conditionTransformers: Record<OperatorKey, ConditionTransformer> = {
  // number
  lt: (condition) => ({
    [condition.field]: {
      ['$' + condition.operator]: condition.value,
    },
  }),
  lte: (condition) => ({
    [condition.field]: {
      ['$' + condition.operator]: condition.value,
    },
  }),
  gt: (condition) => ({
    [condition.field]: {
      ['$' + condition.operator]: condition.value,
    },
  }),
  gte: (condition) => ({
    [condition.field]: {
      ['$' + condition.operator]: condition.value,
    },
  }),

  // text
  like: (condition) => ({
    [condition.field]: {
      $regex: condition.value,
      $options: 'i',
    },
  }),
  'not-like': (condition) => ({
    [condition.field]: {
      $regex: `^((?!${condition.value}).)*$`,
      $options: 'i',
    },
  }),
  'begins-with': (condition) => ({
    [condition.field]: {
      $regex: '^' + condition.value,
      $options: 'i',
    },
  }),
  'ends-with': (condition) => ({
    [condition.field]: {
      $regex: condition.value + '$',
      $options: 'i',
    },
  }),
  'not-begin-with': (condition) => ({
    [condition.field]: {
      $regex: `^((?!^${condition.value}).)*$`,
      $options: 'i',
    },
  }),
  'not-end-with': (condition) => ({
    [condition.field]: {
      $regex: `^((?!${condition.value}$).)*$`,
      $options: 'i',
    },
  }),

  // date
  on: (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        $gte: createDayjs(timezone, condition.value)
          .startOf('day')
          .toAttributeDate(attribute),
        $lt: createDayjs(timezone, condition.value)
          .startOf('day')
          .add(1, 'day')
          .toAttributeDate(attribute),
      },
    };
  },
  'on-or-after': (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        $gte: createDayjs(timezone, condition.value)
          .startOf('day')
          .toAttributeDate(attribute),
      },
    };
  },
  'on-or-before': (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        $lt: createDayjs(timezone, condition.value)
          .startOf('day')
          .add(1, 'day')
          .toAttributeDate(attribute),
      },
    };
  },
  'this-month': (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        $gte: createDayjs(timezone).startOf('month').toAttributeDate(attribute),
        $lt: createDayjs(timezone)
          .add(1, 'month')
          .startOf('month')
          .toAttributeDate(attribute),
      },
    };
  },
  today: (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        $gte: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
        $lt: createDayjs(timezone)
          .add(1, 'day')
          .startOf('day')
          .toAttributeDate(attribute),
      },
    };
  },
  yesterday: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
    },
  }),
  tomorrow: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(2, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'this-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone).startOf('isoWeek').toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(1, 'week')
        .startOf('isoWeek')
        .toAttributeDate(attribute),
    },
  }),
  'this-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone).startOf('year').toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(1, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
    },
  }),
  'this-fiscal-year': (condition, attribute, { timezone }) => {
    const fiscalYear = getFiscalYear(createDayjs(timezone));

    return {
      [condition.field]: {
        $gte: startOfFiscalYear(
          fiscalYear,
          timezone,
          attribute
        ).toAttributeDate(attribute),
        $lt: startOfFiscalYear(
          fiscalYear + 1,
          timezone,
          attribute
        ).toAttributeDate(attribute),
      },
    };
  },
  'next-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .add(1, 'week')
        .startOf('isoWeek')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(2, 'week')
        .startOf('isoWeek')
        .toAttributeDate(attribute),
    },
  }),
  'next-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(8, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'next-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .add(1, 'month')
        .startOf('month')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(2, 'month')
        .startOf('month')
        .toAttributeDate(attribute),
    },
  }),
  'next-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .add(1, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(2, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
    },
  }),
  'next-fiscal-year': (condition, attribute, { timezone }) => {
    const fiscalYear = getFiscalYear(createDayjs(timezone)) + 1;
    return {
      [condition.field]: {
        $gte: startOfFiscalYear(
          fiscalYear,
          timezone,
          attribute
        ).toAttributeDate(attribute),
        $lt: startOfFiscalYear(
          fiscalYear + 1,
          timezone,
          attribute
        ).toAttributeDate(attribute),
      },
    };
  },
  'next-x-hours': (condition, attribute, { timezone }) => {
    return {
      [condition.field]: {
        $gte: createDayjs(timezone).toAttributeDate(attribute),
        $lt: createDayjs(timezone)
          .add(condition.value, 'hour')
          .toAttributeDate(attribute),
      },
    };
  },
  'next-x-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone).startOf('day').toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(condition.value, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'last-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(1, 'week')
        .startOf('isoWeek')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone).startOf('isoWeek').toAttributeDate(attribute),
    },
  }),
  'last-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(7, 'day')
        .tz(timezone)
        .startOf('day')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'last-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(1, 'month')
        .startOf('month')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone).startOf('month').toAttributeDate(attribute),
    },
  }),
  'last-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(1, 'year')
        .startOf('year')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone).startOf('year').toAttributeDate(attribute),
    },
  }),
  'last-fiscal-year': (condition, attribute, { timezone }) => {
    const fiscalYear = getFiscalYear(createDayjs(timezone)) - 1;
    return {
      [condition.field]: {
        $gte: startOfFiscalYear(
          fiscalYear,
          timezone,
          attribute
        ).toAttributeDate(attribute),
        $lt: startOfFiscalYear(
          fiscalYear + 1,
          timezone,
          attribute
        ).toAttributeDate(attribute),
      },
    };
  },
  'last-x-hours': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(condition.value, 'hour')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone).toAttributeDate(attribute),
    },
  }),
  'last-x-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: createDayjs(timezone)
        .subtract(condition.value, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
      $lt: createDayjs(timezone)
        .add(1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'olderthan-x-hours': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $lt: createDayjs(timezone)
        .subtract(condition.value, 'hour')
        .toAttributeDate(attribute),
    },
  }),
  'olderthan-x-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $lt: createDayjs(timezone)
        .subtract(condition.value - 1, 'day')
        .startOf('day')
        .toAttributeDate(attribute),
    },
  }),
  'in-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: startOfFiscalYear(
        condition.value,
        timezone,
        attribute
      ).toAttributeDate(attribute),
      $lt: startOfFiscalYear(
        condition.value + 1,
        timezone,
        attribute
      ).toAttributeDate(attribute),
    },
  }),

  // mixed
  eq: (condition, attribute) => {
    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          $regex: '^' + condition.value + '$',
          $options: 'i',
        },
      };
    }

    if (attribute.type === 'lookup' && 'objectId' in attribute) {
      return {
        [condition.field]: new Types.ObjectId(condition.value as string),
      };
    }

    return {
      [condition.field]: {
        $eq: condition.value,
      },
    };
  },
  ne: (condition, attribute) => {
    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          $regex: `^((?!^${condition.value}$).)*$`,
          $options: 'i',
        },
      };
    }

    if (attribute.type === 'lookup' && 'objectId' in attribute) {
      return {
        [condition.field]: {
          $ne: new Types.ObjectId(condition.value as string),
        },
      };
    }

    return {
      [condition.field]: {
        $ne: condition.value,
      },
    };
  },
  between: (condition, attribute, { timezone }) => {
    if (attribute.type === 'date') {
      if (attribute.format === 'date') {
        return {
          [condition.field]: {
            $gte: createDayjs(timezone, condition.value[0])
              .startOf('day')
              .toAttributeDate(attribute),
            $lt: createDayjs(timezone, condition.value[1])
              .add(1, 'day')
              .startOf('day')
              .toAttributeDate(attribute),
          },
        };
      }

      const inputHasTime =
        hasTime(condition.value[0]) || hasTime(condition.value[1]);

      if (!inputHasTime) {
        return {
          [condition.field]: {
            $gte: createDayjs(timezone, condition.value[0])
              .startOf('day')
              .toAttributeDate(attribute),
            $lt: createDayjs(timezone, condition.value[1])
              .add(1, 'day')
              .startOf('day')
              .toAttributeDate(attribute),
          },
        };
      }

      return {
        [condition.field]: {
          $gte: createDayjs(timezone, condition.value[0]).toDate(),
          $lte: createDayjs(timezone, condition.value[1]).toDate(),
        },
      };
    }

    if (attribute.type === 'number' || attribute.type === 'money') {
      return {
        [condition.field]: {
          $gte: condition.value[0],
          $lte: condition.value[1],
        },
      };
    }

    return null;
  },

  'not-null': (condition) => {
    return {
      [condition.field]: {
        $ne: null,
      },
    };
  },
  null: (condition) => {
    return {
      $or: [
        {
          [condition.field]: {
            $eq: null,
          },
        },
        {
          [condition.field]: {
            $exists: false,
          },
        },
      ],
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
        $or: condition.value.map((value) => {
          if (typeof value === 'boolean') {
            if (value) {
              return {
                [condition.field]: { $eq: true },
              };
            } else {
              return {
                $or: [
                  {
                    [condition.field]: { $exists: false },
                  },
                  {
                    [condition.field]: { $eq: false },
                  },
                  {
                    [condition.field]: { $eq: null },
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

    if (attribute.type === 'choice' || attribute.type === 'choices') {
      return {
        [condition.field]: {
          $in: condition.value,
        },
      };
    }

    if (attribute.type === 'id' || attribute.type === 'lookup') {
      if ('objectId' in attribute) {
        return {
          [condition.field]: {
            $in: condition.value.map((x: string) => new Types.ObjectId(x)),
          },
        };
      }

      return {
        [condition.field]: {
          $in: condition.value,
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
      throw new Error('Value for "not-in" operator must be an array');
    }

    if (!condition.value.length) {
      throw new Error('Value for "not-in" operator cannot be an empty array');
    }

    if (attribute.type === 'boolean') {
      return {
        $and: condition.value.map((value) => {
          if (typeof value === 'boolean') {
            if (value) {
              return {
                $or: [
                  {
                    [condition.field]: { $exists: false },
                  },
                  {
                    [condition.field]: { $eq: false },
                  },
                  {
                    [condition.field]: { $eq: null },
                  },
                ],
              };
            } else {
              return {
                [condition.field]: { $eq: true },
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
          $nin: condition.value,
        },
      };
    }

    if (attribute.type === 'id' || attribute.type === 'lookup') {
      if ('objectId' in attribute) {
        return {
          [condition.field]: {
            $nin: condition.value.map((x: string) => new Types.ObjectId(x)),
          },
        };
      }

      return {
        [condition.field]: {
          $nin: condition.value,
        },
      };
    }

    if (attribute.type === 'string') {
      return {
        [condition.field]: {
          $nin: condition.value,
        },
      };
    }

    throw new Error('Invalid type');
  },
};

export function transformCondition(
  condition: Condition,
  attribute: Attribute,
  options: ConditionTransformerOptions
): { [key: string]: any } | null {
  const transformer = conditionTransformers[condition.operator];

  if (!transformer) {
    return null;
  }

  if (!attribute) {
    throw new Error(`Attribute not found: ${condition.field}`);
  }

  return transformer(condition, attribute, options);
}

export function transformFilter<SA extends MongoRequiredSchemaAttributes>(
  filter: Filter | null | undefined,
  schema: Schema<SA>,
  options: ConditionTransformerOptions
): FilterQuery<any> | null {
  if (!filter) {
    return null;
  }

  const items: unknown[] = [];
  if (filter.conditions?.length) {
    const conditions = filter.conditions
      .map((condition) =>
        transformCondition(
          condition,
          schema.attributes[condition.field],
          options
        )
      )
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
    [filter.type === 'or' ? '$or' : '$and']: items,
  };
}
