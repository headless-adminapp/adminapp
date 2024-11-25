import { Attribute } from '@headless-adminapp/core/attributes';
import { Schema } from '@headless-adminapp/core/schema';
import {
  Condition,
  Filter,
  OperatorKey,
} from '@headless-adminapp/core/transport';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { FilterQuery, Types } from 'mongoose';

import { MongoRequiredSchemaAttributes } from './types';

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

interface ConditionTransformerOptions {
  timezone: string;
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
  on: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs(condition.value).tz(timezone).startOf('day').toDate(),
      $lte: dayjs(condition.value).tz(timezone).endOf('day').toDate(),
    },
  }),
  'on-or-after': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs(condition.value).tz(timezone).startOf('day').toDate(),
    },
  }),
  'on-or-before': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $lte: dayjs(condition.value).tz(timezone).endOf('day').toDate(),
    },
  }),
  'this-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().tz(timezone).startOf('month').toDate(),
      $lte: dayjs().tz(timezone).endOf('month').toDate(),
    },
  }),
  today: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().tz(timezone).startOf('day').toDate(),
      $lte: dayjs().tz(timezone).endOf('day').toDate(),
    },
  }),
  yesterday: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().subtract(1, 'day').tz(timezone).startOf('day').toDate(),
      $lte: dayjs().subtract(1, 'day').tz(timezone).endOf('day').toDate(),
    },
  }),
  tomorrow: (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().add(1, 'day').tz(timezone).startOf('day').toDate(),
      $lte: dayjs().add(1, 'day').tz(timezone).endOf('day').toDate(),
    },
  }),
  'this-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().tz(timezone).startOf('week').toDate(),
      $lte: dayjs().tz(timezone).endOf('week').toDate(),
    },
  }),
  'this-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().tz(timezone).startOf('year').toDate(),
      $lte: dayjs().tz(timezone).endOf('year').toDate(),
    },
  }),
  'this-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte:
        dayjs().month() < 3
          ? startOfFiscalYear(dayjs().year() - 1, timezone).toDate()
          : startOfFiscalYear(dayjs().year(), timezone).toDate(),
      $lte:
        dayjs().month() < 3
          ? endOfFiscalYear(dayjs().year() - 1, timezone).toDate()
          : endOfFiscalYear(dayjs().year(), timezone).toDate(),
    },
  }),
  'next-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().add(1, 'week').tz(timezone).startOf('week').toDate(),
      $lte: dayjs().add(1, 'week').tz(timezone).endOf('week').toDate(),
    },
  }),
  'next-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().tz(timezone).startOf('day').toDate(),
      $lte: dayjs().tz(timezone).add(7, 'day').endOf('day').toDate(),
    },
  }),
  'next-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().add(1, 'month').tz(timezone).startOf('month').toDate(),
      $lte: dayjs().add(1, 'month').tz(timezone).endOf('month').toDate(),
    },
  }),
  'next-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().add(1, 'year').tz(timezone).startOf('year').toDate(),
      $lte: dayjs().add(1, 'year').tz(timezone).endOf('year').toDate(),
    },
  }),
  'next-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte:
        dayjs().month() < 3
          ? startOfFiscalYear(dayjs().year(), timezone).toDate()
          : startOfFiscalYear(dayjs().year() + 1, timezone).toDate(),
      $lte:
        dayjs().month() < 3
          ? endOfFiscalYear(dayjs().year(), timezone).toDate()
          : endOfFiscalYear(dayjs().year() + 1, timezone).toDate(),
    },
  }),
  'next-x-hours': (condition) => ({
    [condition.field]: {
      $gte: dayjs().add(condition.value, 'hour').toDate(),
    },
  }),
  'next-x-days': (condition) => ({
    [condition.field]: {
      $gte: dayjs().add(condition.value, 'day').toDate(),
    },
  }),
  'next-x-weeks': (condition) => ({
    [condition.field]: {
      $gte: dayjs().add(condition.value, 'week').toDate(),
    },
  }),
  'next-x-months': (condition) => ({
    [condition.field]: {
      $gte: dayjs().add(condition.value, 'month').toDate(),
    },
  }),
  'next-x-years': (condition) => ({
    [condition.field]: {
      $gte: dayjs().add(condition.value, 'year').toDate(),
    },
  }),
  'last-week': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().subtract(1, 'week').tz(timezone).startOf('week').toDate(),
      $lte: dayjs().subtract(1, 'week').tz(timezone).endOf('week').toDate(),
    },
  }),
  'last-seven-days': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().subtract(7, 'day').tz(timezone).startOf('day').toDate(),
      $lte: dayjs().subtract(1, 'day').tz(timezone).endOf('day').toDate(),
    },
  }),
  'last-month': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().subtract(1, 'month').tz(timezone).startOf('month').toDate(),
      $lte: dayjs().subtract(1, 'month').tz(timezone).endOf('month').toDate(),
    },
  }),
  'last-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().subtract(1, 'year').tz(timezone).startOf('year').toDate(),
      $lte: dayjs().subtract(1, 'year').tz(timezone).endOf('year').toDate(),
    },
  }),
  'last-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte:
        dayjs().month() < 3
          ? startOfFiscalYear(dayjs().year() - 2, timezone).toDate()
          : startOfFiscalYear(dayjs().year() - 1, timezone).toDate(),
      $lte:
        dayjs().month() < 3
          ? endOfFiscalYear(dayjs().year() - 2, timezone).toDate()
          : endOfFiscalYear(dayjs().year() - 1, timezone).toDate(),
    },
  }),
  'last-x-hours': (condition) => ({
    [condition.field]: {
      $gte: dayjs().subtract(condition.value, 'hour').toDate(),
    },
  }),
  'last-x-days': (condition) => ({
    [condition.field]: {
      $gte: dayjs().subtract(condition.value, 'day').toDate(),
    },
  }),
  'last-x-weeks': (condition) => ({
    [condition.field]: {
      $gte: dayjs().subtract(condition.value, 'week').toDate(),
    },
  }),
  'last-x-months': (condition) => ({
    [condition.field]: {
      $gte: dayjs().subtract(condition.value, 'month').toDate(),
    },
  }),
  'last-x-years': (condition) => ({
    [condition.field]: {
      $gte: dayjs().subtract(condition.value, 'year').toDate(),
    },
  }),
  'olderthan-x-hours': (condition) => ({
    [condition.field]: {
      $lte: dayjs().subtract(condition.value, 'hour').toDate(),
    },
  }),
  'olderthan-x-days': (condition) => ({
    [condition.field]: {
      $lte: dayjs().subtract(condition.value, 'day').toDate(),
    },
  }),
  'olderthan-x-weeks': (condition) => ({
    [condition.field]: {
      $lte: dayjs().subtract(condition.value, 'week').toDate(),
    },
  }),
  'olderthan-x-months': (condition) => ({
    [condition.field]: {
      $lte: dayjs().subtract(condition.value, 'month').toDate(),
    },
  }),
  'olderthan-x-years': (condition) => ({
    [condition.field]: {
      $lte: dayjs().subtract(condition.value, 'year').toDate(),
    },
  }),
  'in-fiscal-year': (condition, attribute, { timezone }) => ({
    [condition.field]: {
      $gte: dayjs().tz(timezone).startOf('year').toDate(),
      $lte: dayjs().tz(timezone).endOf('year').toDate(),
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

    if (attribute.type === 'lookup') {
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

    return {
      [condition.field]: {
        $ne: condition.value,
      },
    };
  },
  between: (condition, attribute) => {
    if (attribute.type === 'date') {
      return {
        [condition.field]: {
          $gte: new Date(condition.value[0]),
          $lte: new Date(condition.value[1]),
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
      $and: [
        {
          [condition.field]: {
            $ne: null,
          },
        },
      ],
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
      throw new Error('Invalid value');
    }

    if (
      attribute.type === 'boolean' ||
      attribute.type === 'choice' ||
      attribute.type === 'choices'
    ) {
      return {
        [condition.field]: {
          $in: condition.value,
        },
      };
    }

    if (attribute.type === 'id') {
      return {
        [condition.field]: {
          $in: condition.value.map((x: string) => new Types.ObjectId(x)),
        },
      };
    }

    if (attribute.type === 'lookup') {
      return {
        [condition.field]: {
          $in: condition.value.map((x: string) => new Types.ObjectId(x)),
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
          $nin: condition.value,
        },
      };
    }

    if (attribute.type === 'id') {
      return {
        [condition.field]: {
          $nin: condition.value.map((x: string) => new Types.ObjectId(x)),
        },
      };
    }

    if (attribute.type === 'lookup') {
      return {
        [condition.field]: {
          $nin: condition.value.map((x: string) => new Types.ObjectId(x)),
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
