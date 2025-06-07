import {
  defineSchema,
  defineSchemaAttributes,
} from '@headless-adminapp/core/schema/utils';
import {
  Condition,
  Filter,
  OperatorKey,
} from '@headless-adminapp/core/transport';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { transformCondition, transformFilter } from './conditions';

const PANAMA_TIMEZONE = 'America/Panama'; // NO DST
const UTC_TIMEZONE = 'UTC';
const TOKYO_TIMEZONE = 'Asia/Tokyo';

const PANAMA_NOW = '2025-01-01T06:00:00.000Z'; // 1 AM
const UTC_NOW = '2025-01-01T01:00:00.000Z'; // 1 AM
const TOKYO_NOW = '2024-12-31T16:00:00.000Z'; // 1 AM

const timezone = TOKYO_TIMEZONE;

interface TimezoneDates {
  [timezone: string]: string;
}

const dates = {
  NOW: {
    [PANAMA_TIMEZONE]: PANAMA_NOW,
    [UTC_TIMEZONE]: UTC_NOW,
    [TOKYO_TIMEZONE]: TOKYO_NOW,
  } as TimezoneDates,
  START_OF_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_YESTERDAY: {
    [PANAMA_TIMEZONE]: '2024-12-31T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-30T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_YESTERDAY: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_TOMORROW: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_TOMORROW: {
    [PANAMA_TIMEZONE]: '2025-01-03T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-03T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-02T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_MONTH: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_MONTH: {
    [PANAMA_TIMEZONE]: '2025-02-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-02-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-06T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-06T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-05T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_YEAR: {
    [PANAMA_TIMEZONE]: '2026-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2024-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-03-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2025-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-03-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-06T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-06T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-05T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-13T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-13T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-12T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_MONTH: {
    [PANAMA_TIMEZONE]: '2025-02-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-02-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_MONTH: {
    [PANAMA_TIMEZONE]: '2025-03-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-03-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-02-28T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_YEAR: {
    [PANAMA_TIMEZONE]: '2026-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_YEAR: {
    [PANAMA_TIMEZONE]: '2027-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2027-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2026-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2025-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-03-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2026-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2026-03-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T06:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T01:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T16:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T08:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T03:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T18:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_7_DAYS: {
    [PANAMA_TIMEZONE]: '2025-01-09T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-09T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-08T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_2_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_2_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-03T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-03T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-02T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_2_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-13T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-12T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-12T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_2_MONTH: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_2_MONTH: {
    [PANAMA_TIMEZONE]: '2025-03-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-02-28T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-02-28T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_NEXT_2_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_NEXT_2_YEAR: {
    [PANAMA_TIMEZONE]: '2027-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2026-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-23T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-23T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-22T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_7_DAYS: {
    [PANAMA_TIMEZONE]: '2024-12-25T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-25T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-24T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_7_DAYS: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_MONTH: {
    [PANAMA_TIMEZONE]: '2024-12-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-11-30T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_MONTH: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_YEAR: {
    [PANAMA_TIMEZONE]: '2024-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2023-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2023-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2023-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2023-03-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2024-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-03-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T04:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T23:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T14:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T06:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T01:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T16:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_2_DAY: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_2_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-15T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-15T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-14T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-29T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-28T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-28T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-11-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-11-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-10-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-12-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-11-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-11-30T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_LAST_2_YEAR: {
    [PANAMA_TIMEZONE]: '2023-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2023-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2022-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_LAST_2_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
  } as TimezoneDates,
  OLDER_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T04:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T23:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T14:00:00.000Z',
  } as TimezoneDates,
  OLDER_2_DAY: {
    [PANAMA_TIMEZONE]: '2024-12-31T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-30T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_OLDER_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-15T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-15T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-14T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_OLDER_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-29T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-28T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-28T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_OLDER_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-10-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-10-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-09-30T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_OLDER_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-11-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-10-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-10-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_OLDER_2_YEAR: {
    [PANAMA_TIMEZONE]: '2022-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2022-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2021-12-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_OLDER_2_YEAR: {
    [PANAMA_TIMEZONE]: '2024-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2023-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2023-12-31T15:00:00.000Z',
  } as TimezoneDates,
  START_OF_2027_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2027-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2027-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2027-03-31T15:00:00.000Z',
  } as TimezoneDates,
  END_OF_2027_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2028-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2028-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2028-03-31T15:00:00.000Z',
  } as TimezoneDates,
};

const attributes = defineSchemaAttributes({
  integer: {
    type: 'number',
    format: 'integer',
    label: '',
  },
  string: {
    type: 'string',
    format: 'text',
    label: '',
  },
  date: {
    type: 'date',
    format: 'date',
    label: '',
  },
  datetime: {
    type: 'date',
    format: 'datetime',
    label: '',
  },
  lookupObjectId: {
    type: 'lookup',
    objectId: true,
    label: '',
    entity: '',
  },
  lookupString: {
    type: 'lookup',
    string: true,
    label: '',
    entity: '',
  },
  lookupNumber: {
    type: 'lookup',
    number: true,
    label: '',
    entity: '',
  },
  idObjectId: {
    type: 'id',
    objectId: true,
    label: '',
    entity: '',
  },
  idString: {
    type: 'id',
    string: true,
    label: '',
    entity: '',
  },
  idNumber: {
    type: 'id',
    number: true,
    label: '',
    entity: '',
  },
  number: {
    type: 'number',
    format: 'integer',
    label: '',
  },
  money: {
    type: 'money',
    label: '',
  },
  boolean: {
    type: 'boolean',
    label: '',
  },
  choice: {
    type: 'choice',
    label: '',
    string: true,
    options: [],
  },
  choices: {
    type: 'choices',
    label: '',
    string: true,
    options: [],
  },
});

describe('conditions', () => {
  describe.each([['lt'], ['lte'], ['gt'], ['gte']])('%s', (operator) => {
    it('number', () => {
      const condition: Condition = {
        field: 'age',
        operator: operator as OperatorKey,
        value: 18,
      };
      const result = transformCondition(condition, attributes.integer, {
        timezone,
      });
      expect(result).toEqual({
        age: {
          [`$${operator}`]: 18,
        },
      });
    });
  });

  describe('like', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'like',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: 'John',
          $options: 'i',
        },
      });
    });
  });

  describe('not-like', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-like',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: '^((?!John).)*$',
          $options: 'i',
        },
      });
    });
  });

  describe('begins-with', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'begins-with',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: '^John',
          $options: 'i',
        },
      });
    });
  });

  describe('ends-with', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'ends-with',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: 'John$',
          $options: 'i',
        },
      });
    });
  });

  describe('not-begin-with', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-begin-with',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: '^((?!^John).)*$',
          $options: 'i',
        },
      });
    });
  });

  describe('not-end-with', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-end-with',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: '^((?!John$).)*$',
          $options: 'i',
        },
      });
    });
  });

  describe.each([
    [
      'on',
      '2025-01-01',
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_DAY[timezone]),
        $lt: new Date(dates.END_OF_DAY[timezone]),
      }),
    ],
    [
      'on-or-after',
      '2025-01-01',
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_DAY[timezone]),
      }),
    ],
    [
      'on-or-before',
      '2025-01-01',
      (timezone: string) => ({
        $lt: new Date(dates.END_OF_DAY[timezone]),
      }),
    ],
    [
      'this-month',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_MONTH[timezone]),
        $lt: new Date(dates.END_OF_MONTH[timezone]),
      }),
    ],
    [
      'today',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_DAY[timezone]),
        $lt: new Date(dates.END_OF_DAY[timezone]),
      }),
    ],
    [
      'yesterday',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_YESTERDAY[timezone]),
        $lt: new Date(dates.END_OF_YESTERDAY[timezone]),
      }),
    ],
    [
      'tomorrow',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_TOMORROW[timezone]),
        $lt: new Date(dates.END_OF_TOMORROW[timezone]),
      }),
    ],
    [
      'this-week',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_WEEK[timezone]),
        $lt: new Date(dates.END_OF_WEEK[timezone]),
      }),
    ],
    [
      'this-year',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_YEAR[timezone]),
        $lt: new Date(dates.END_OF_YEAR[timezone]),
      }),
    ],
    [
      'this-fiscal-year',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_FISCAL_YEAR[timezone]),
        $lt: new Date(dates.END_OF_FISCAL_YEAR[timezone]),
      }),
    ],
    [
      'next-week',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_NEXT_WEEK[timezone]),
        $lt: new Date(dates.END_OF_NEXT_WEEK[timezone]),
      }),
    ],
    [
      'next-seven-days',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_DAY[timezone]),
        $lt: new Date(dates.END_OF_NEXT_7_DAYS[timezone]),
      }),
    ],
    [
      'next-month',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_NEXT_MONTH[timezone]),
        $lt: new Date(dates.END_OF_NEXT_MONTH[timezone]),
      }),
    ],
    [
      'next-year',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_NEXT_YEAR[timezone]),
        $lt: new Date(dates.END_OF_NEXT_YEAR[timezone]),
      }),
    ],
    [
      'next-fiscal-year',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_NEXT_FISCAL_YEAR[timezone]),
        $lt: new Date(dates.END_OF_NEXT_FISCAL_YEAR[timezone]),
      }),
    ],
    [
      'next-x-hours',
      2,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_NEXT_2_HOUR[timezone]),
        $lt: new Date(dates.END_OF_NEXT_2_HOUR[timezone]),
      }),
    ],
    [
      'next-x-days',
      2,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_NEXT_2_DAY[timezone]),
        $lt: new Date(dates.END_OF_NEXT_2_DAY[timezone]),
      }),
    ],
    [
      'last-week',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_WEEK[timezone]),
        $lt: new Date(dates.END_OF_LAST_WEEK[timezone]),
      }),
    ],
    [
      'last-seven-days',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_7_DAYS[timezone]),
        $lt: new Date(dates.END_OF_LAST_7_DAYS[timezone]),
      }),
    ],
    [
      'last-month',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_MONTH[timezone]),
        $lt: new Date(dates.END_OF_LAST_MONTH[timezone]),
      }),
    ],
    [
      'last-year',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_YEAR[timezone]),
        $lt: new Date(dates.END_OF_LAST_YEAR[timezone]),
      }),
    ],
    [
      'last-fiscal-year',
      null,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_FISCAL_YEAR[timezone]),
        $lt: new Date(dates.END_OF_LAST_FISCAL_YEAR[timezone]),
      }),
    ],
    [
      'last-x-hours',
      2,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_2_HOUR[timezone]),
        $lt: new Date(dates.END_OF_LAST_2_HOUR[timezone]),
      }),
    ],
    [
      'last-x-days',
      2,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_LAST_2_DAY[timezone]),
        $lt: new Date(dates.END_OF_LAST_2_DAY[timezone]),
      }),
    ],
    [
      'olderthan-x-hours',
      2,
      (timezone: string) => ({
        $lt: new Date(dates.OLDER_2_HOUR[timezone]),
      }),
    ],
    [
      'olderthan-x-days',
      2,
      (timezone: string) => ({
        $lt: new Date(dates.OLDER_2_DAY[timezone]),
      }),
    ],
    [
      'in-fiscal-year',
      2027,
      (timezone: string) => ({
        $gte: new Date(dates.START_OF_2027_FISCAL_YEAR[timezone]),
        $lt: new Date(dates.END_OF_2027_FISCAL_YEAR[timezone]),
      }),
    ],
  ])('%s', (operator, value, expectedFn) => {
    describe.each([
      // PANAMA_TIMEZONE,
      UTC_TIMEZONE,
      // TOKYO_TIMEZONE,
      //
    ])('%s', (timezone) => {
      beforeAll(() => {
        vi.setSystemTime(dates.NOW[timezone]);
      });

      it('date', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: operator as OperatorKey,
          value,
        };
        const result = transformCondition(condition, attributes.date, {
          timezone,
        });
        expect(result).toEqual({
          createdAt: expectedFn('UTC'),
        });
      });

      it('datetime', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: operator as OperatorKey,
          value: value,
        };
        const result = transformCondition(condition, attributes.datetime, {
          timezone,
        });
        expect(result).toEqual({
          createdAt: expectedFn(timezone),
        });
      });
    });
  });

  describe('eq', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'eq',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: '^John$',
          $options: 'i',
        },
      });
    });

    describe('lookup', () => {
      it('objectid', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'eq',
          value: '0123456789abcdef01234567',
        };
        const result = transformCondition(
          condition,
          attributes.lookupObjectId,
          {
            timezone,
          }
        );
        expect(result?.parent.toString()).toBe('0123456789abcdef01234567');
      });
      it('string', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'eq',
          value: 'abc',
        };
        const result = transformCondition(condition, attributes.lookupString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $eq: 'abc',
          },
        });
      });
      it('number', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'eq',
          value: 123,
        };
        const result = transformCondition(condition, attributes.lookupString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $eq: 123,
          },
        });
      });
    });
  });

  describe('ne', () => {
    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'ne',
        value: 'John',
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $regex: '^((?!^John$).)*$',
          $options: 'i',
        },
      });
    });

    describe('lookup', () => {
      it('objectid', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'ne',
          value: '0123456789abcdef01234567',
        };
        const result = transformCondition(
          condition,
          attributes.lookupObjectId,
          {
            timezone,
          }
        );
        expect(result?.parent.$ne.toString()).toBe('0123456789abcdef01234567');
      });
      it('string', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'ne',
          value: 'abc',
        };
        const result = transformCondition(condition, attributes.lookupString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $ne: 'abc',
          },
        });
      });
      it('number', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'ne',
          value: 123,
        };
        const result = transformCondition(condition, attributes.lookupString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $ne: 123,
          },
        });
      });
    });
  });

  describe('between', () => {
    describe('date', () => {
      it('date', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: 'between',
          value: ['2025-01-01', '2025-01-01'],
        };

        const result = transformCondition(condition, attributes.date, {
          timezone,
        });

        expect(result).toEqual({
          createdAt: {
            $gte: new Date('2025-01-01T00:00:00.000Z'),
            $lt: new Date('2025-01-02T00:00:00.000Z'),
          },
        });
      });
    });

    describe('datetime', () => {
      it('input has date only', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: 'between',
          value: ['2025-01-01', '2025-01-01'],
        };

        const result = transformCondition(condition, attributes.datetime, {
          timezone,
        });

        expect(result).toEqual({
          createdAt: {
            $gte: new Date('2024-12-31T15:00:00.000Z'),
            $lt: new Date('2025-01-01T15:00:00.000Z'),
          },
        });
      });

      it('input has date and time', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: 'between',
          value: ['2025-01-01T04:00:00.000Z', '2025-01-01T06:00:00.000Z'],
        };

        const result = transformCondition(condition, attributes.datetime, {
          timezone,
        });

        expect(result).toEqual({
          createdAt: {
            $gte: new Date('2025-01-01T04:00:00.000Z'),
            $lte: new Date('2025-01-01T06:00:00.000Z'),
          },
        });
      });
    });

    it('number', () => {
      const condition: Condition = {
        field: 'age',
        operator: 'between',
        value: [4, 9],
      };

      const result = transformCondition(condition, attributes.number, {
        timezone,
      });

      expect(result).toEqual({
        age: {
          $gte: 4,
          $lte: 9,
        },
      });
    });

    it('money', () => {
      const condition: Condition = {
        field: 'age',
        operator: 'between',
        value: [450, 950],
      };

      const result = transformCondition(condition, attributes.money, {
        timezone,
      });

      expect(result).toEqual({
        age: {
          $gte: 450,
          $lte: 950,
        },
      });
    });

    it('null for other types', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'between',
        value: ['John', 'Doe'],
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toBeNull();
    });
  });

  it('not-null', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'not-null',
      value: null,
    };
    const result = transformCondition(condition, attributes.string, {
      timezone,
    });
    expect(result).toEqual({
      name: {
        $ne: null,
      },
    });
  });

  it('null', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'null',
      value: null,
    };
    const result = transformCondition(condition, attributes.string, {
      timezone,
    });
    expect(result).toEqual({
      $or: [
        {
          name: {
            $eq: null,
          },
        },
        {
          name: {
            $exists: false,
          },
        },
      ],
    });
  });

  describe('in', () => {
    it('should throw an error if value is not an array', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'in',
        value: 'John',
      };
      expect(() => {
        transformCondition(condition, attributes.string, {
          timezone,
        });
      }).toThrow('Value for "in" operator must be an array');
    });

    it('should throw an error if value is empty', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'in',
        value: [],
      };
      expect(() => {
        transformCondition(condition, attributes.string, {
          timezone,
        });
      }).toThrow('Value for "in" operator cannot be an empty array');
    });

    describe('boolean', () => {
      it('valid input', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'in',
          value: [true, false],
        };

        const result = transformCondition(condition, attributes.boolean, {
          timezone,
        });

        expect(result).toEqual({
          $or: [
            { isActive: { $eq: true } },
            {
              $or: [
                {
                  isActive: { $exists: false },
                },
                {
                  isActive: { $eq: false },
                },
                {
                  isActive: { $eq: null },
                },
              ],
            },
          ],
        });
      });

      it('should throw an error for invalid input', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'in',
          value: [1],
        };
        expect(() => {
          transformCondition(condition, attributes.boolean, {
            timezone,
          });
        }).toThrow('Invalid value for boolean type');
      });
    });

    it('choice', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(condition, attributes.choice, {
        timezone,
      });
      expect(result).toEqual({
        status: {
          $in: ['active', 'inactive'],
        },
      });
    });

    it('choices', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(condition, attributes.choices, {
        timezone,
      });
      expect(result).toEqual({
        status: {
          $in: ['active', 'inactive'],
        },
      });
    });

    describe('id', () => {
      it('objectid', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'in',
          value: ['0123456789abcdef01234567', 'abcdef0123456789abcdef01'],
        };
        const result = transformCondition(condition, attributes.idObjectId, {
          timezone,
        });
        expect(result?.parent.$in.map((x: any) => x.toString())).toEqual([
          '0123456789abcdef01234567',
          'abcdef0123456789abcdef01',
        ]);
      });

      it('string', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'in',
          value: ['abc', 'def'],
        };
        const result = transformCondition(condition, attributes.idString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $in: ['abc', 'def'],
          },
        });
      });
      it('number', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'in',
          value: [123, 456],
        };
        const result = transformCondition(condition, attributes.idNumber, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $in: [123, 456],
          },
        });
      });
    });

    describe('lookup', () => {
      it('objectid', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'in',
          value: ['0123456789abcdef01234567', 'abcdef0123456789abcdef01'],
        };
        const result = transformCondition(
          condition,
          attributes.lookupObjectId,
          {
            timezone,
          }
        );
        expect(result?.parent.$in.map((x: any) => x.toString())).toEqual([
          '0123456789abcdef01234567',
          'abcdef0123456789abcdef01',
        ]);
      });

      it('string', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'in',
          value: ['abc', 'def'],
        };
        const result = transformCondition(condition, attributes.lookupString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $in: ['abc', 'def'],
          },
        });
      });

      it('number', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'in',
          value: [123, 456],
        };
        const result = transformCondition(condition, attributes.lookupNumber, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $in: [123, 456],
          },
        });
      });
    });

    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'in',
        value: ['John', 'Doe'],
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $in: ['John', 'Doe'],
        },
      });
    });

    it('throw error for unsupported types', () => {
      const condition: Condition = {
        field: 'createdAt',
        operator: 'in',
        value: ['2025-01-01', '2025-01-02'],
      };

      expect(() => {
        transformCondition(condition, attributes.date, {
          timezone,
        });
      }).toThrow('Invalid type');
    });
  });

  describe('not-in', () => {
    it('should throw an error if value is not an array', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-in',
        value: 'John',
      };
      expect(() => {
        transformCondition(condition, attributes.string, {
          timezone,
        });
      }).toThrow('Value for "not-in" operator must be an array');
    });

    it('should throw an error if value is empty', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-in',
        value: [],
      };
      expect(() => {
        transformCondition(condition, attributes.string, {
          timezone,
        });
      }).toThrow('Value for "not-in" operator cannot be an empty array');
    });

    describe('boolean', () => {
      it('[true]', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'not-in',
          value: [true],
        };

        const result = transformCondition(condition, attributes.boolean, {
          timezone,
        });
        expect(result).toEqual({
          $and: [
            {
              $or: [
                {
                  isActive: { $exists: false },
                },
                {
                  isActive: { $eq: false },
                },
                {
                  isActive: { $eq: null },
                },
              ],
            },
          ],
        });
      });
      it('[false]', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'not-in',
          value: [false],
        };

        const result = transformCondition(condition, attributes.boolean, {
          timezone,
        });

        expect(result).toEqual({
          $and: [
            {
              isActive: { $eq: true },
            },
          ],
        });
      });

      it('[true, false]', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'not-in',
          value: [true, false],
        };

        const result = transformCondition(condition, attributes.boolean, {
          timezone,
        });

        expect(result).toEqual({
          $and: [
            {
              $or: [
                {
                  isActive: { $exists: false },
                },
                {
                  isActive: { $eq: false },
                },
                {
                  isActive: { $eq: null },
                },
              ],
            },
            { isActive: { $eq: true } },
          ],
        });
      });

      it('should throw an error for invalid input', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'not-in',
          value: [1],
        };
        expect(() => {
          transformCondition(condition, attributes.boolean, {
            timezone,
          });
        }).toThrow('Invalid value for boolean type');
      });
    });

    it('choice', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'not-in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(condition, attributes.choice, {
        timezone,
      });
      expect(result).toEqual({
        status: {
          $nin: ['active', 'inactive'],
        },
      });
    });

    it('choices', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'not-in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(condition, attributes.choices, {
        timezone,
      });
      expect(result).toEqual({
        status: {
          $nin: ['active', 'inactive'],
        },
      });
    });

    describe('id', () => {
      it('objectid', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'not-in',
          value: ['0123456789abcdef01234567', 'abcdef0123456789abcdef01'],
        };
        const result = transformCondition(condition, attributes.idObjectId, {
          timezone,
        });
        expect(result?.parent.$nin.map((x: any) => x.toString())).toEqual([
          '0123456789abcdef01234567',
          'abcdef0123456789abcdef01',
        ]);
      });

      it('string', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'not-in',
          value: ['abc', 'def'],
        };
        const result = transformCondition(condition, attributes.idString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $nin: ['abc', 'def'],
          },
        });
      });
      it('number', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'not-in',
          value: [123, 456],
        };
        const result = transformCondition(condition, attributes.idNumber, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $nin: [123, 456],
          },
        });
      });
    });

    describe('lookup', () => {
      it('objectid', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'not-in',
          value: ['0123456789abcdef01234567', 'abcdef0123456789abcdef01'],
        };
        const result = transformCondition(
          condition,
          attributes.lookupObjectId,
          {
            timezone,
          }
        );
        expect(result?.parent.$nin.map((x: any) => x.toString())).toEqual([
          '0123456789abcdef01234567',
          'abcdef0123456789abcdef01',
        ]);
      });

      it('string', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'not-in',
          value: ['abc', 'def'],
        };
        const result = transformCondition(condition, attributes.lookupString, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $nin: ['abc', 'def'],
          },
        });
      });

      it('number', () => {
        const condition: Condition = {
          field: 'parent',
          operator: 'not-in',
          value: [123, 456],
        };
        const result = transformCondition(condition, attributes.lookupNumber, {
          timezone,
        });
        expect(result).toEqual({
          parent: {
            $nin: [123, 456],
          },
        });
      });
    });

    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-in',
        value: ['John', 'Doe'],
      };
      const result = transformCondition(condition, attributes.string, {
        timezone,
      });
      expect(result).toEqual({
        name: {
          $nin: ['John', 'Doe'],
        },
      });
    });

    it('throw error for unsupported types', () => {
      const condition: Condition = {
        field: 'createdAt',
        operator: 'not-in',
        value: ['2025-01-01', '2025-01-02'],
      };

      expect(() => {
        transformCondition(condition, attributes.date, {
          timezone,
        });
      }).toThrow('Invalid type');
    });
  });
});

describe('transformCondition', () => {
  it('should return null for invalid operator', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'invalid',
      value: 'John',
    } as any;

    const result = transformCondition(condition, attributes.string, {
      timezone,
    });
    expect(result).toBeNull();
  });

  it('should throw any error if attribute is null', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'eq',
      value: 'John',
    } as any;
    expect(() => {
      transformCondition(condition, null as any, {
        timezone,
      });
    }).toThrow('Attribute not found: name');
  });
});

describe('transformFilter', () => {
  const schema = defineSchema({
    attributes,
  } as any) as any;

  it('should return null for nullish filter', () => {
    const result = transformFilter(null, schema, { timezone });
    expect(result).toBeNull();
  });

  it('should return null for empty filter', () => {
    const result = transformFilter(
      { type: 'and', conditions: [] } as any,
      schema,
      { timezone }
    );
    expect(result).toBeNull();
  });

  it('should transform a valid filter', () => {
    const filter: Filter = {
      type: 'and',
      conditions: [
        {
          field: 'string',
          operator: 'eq',
          value: 'John',
        },
        {
          field: 'number',
          operator: 'gt',
          value: 18,
        },
      ],
      filters: [
        {
          type: 'or',
          conditions: [
            {
              field: 'choice',
              operator: 'in',
              value: ['active', 'inactive'],
            },
            {
              field: 'date',
              operator: 'between',
              value: ['2025-01-01', '2025-01-02'],
            },
          ],
        },
      ],
    };
    const result = transformFilter(filter, schema, { timezone });
    expect(result).toEqual({
      $and: [
        {
          string: {
            $regex: '^John$',
            $options: 'i',
          },
        },
        {
          number: {
            $gt: 18,
          },
        },
        {
          $or: [
            {
              choice: {
                $in: ['active', 'inactive'],
              },
            },
            {
              date: {
                $gte: new Date('2025-01-01T00:00:00.000Z'),
                $lt: new Date('2025-01-03T00:00:00.000Z'),
              },
            },
          ],
        },
      ],
    });
  });
});
