import {
  defineSchema,
  defineSchemaAttributes,
} from '@headless-adminapp/core/schema/utils';
import {
  Condition,
  Filter,
  OperatorKey,
} from '@headless-adminapp/core/transport';
import { Op, Sequelize } from 'sequelize';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { transformCondition, transformFilter } from './conditions';
import { SequelizeSchemaStore } from './SequelizeSchemaStore';

const PANAMA_TIMEZONE = 'America/Panama'; // NO DST
const UTC_TIMEZONE = 'UTC';
const TOKYO_TIMEZONE = 'Asia/Tokyo';
const DATE_ONLY = 'date-only';

const PANAMA_NOW = '2025-01-01T06:00:00.000Z'; // 1 AM
const UTC_NOW = '2025-01-01T01:00:00.000Z'; // 1 AM
const TOKYO_NOW = '2024-12-31T16:00:00.000Z'; // 1 AM
const DATE_ONLY_NOW = '2025-01-01'; // Date without time

const timezone = TOKYO_TIMEZONE;

interface TimezoneDates {
  [timezone: string]: string;
}

const dates = {
  NOW: {
    [PANAMA_TIMEZONE]: PANAMA_NOW,
    [UTC_TIMEZONE]: UTC_NOW,
    [TOKYO_TIMEZONE]: TOKYO_NOW,
    [DATE_ONLY]: DATE_ONLY_NOW,
  } as TimezoneDates,
  START_OF_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-02',
  } as TimezoneDates,
  START_OF_YESTERDAY: {
    [PANAMA_TIMEZONE]: '2024-12-31T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-30T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-31',
  } as TimezoneDates,
  END_OF_YESTERDAY: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  START_OF_TOMORROW: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-02',
  } as TimezoneDates,
  END_OF_TOMORROW: {
    [PANAMA_TIMEZONE]: '2025-01-03T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-03T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-02T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-03',
  } as TimezoneDates,
  START_OF_MONTH: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_MONTH: {
    [PANAMA_TIMEZONE]: '2025-02-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-02-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-02-01',
  } as TimezoneDates,
  START_OF_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-30',
  } as TimezoneDates,
  END_OF_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-06T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-06T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-05T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-06',
  } as TimezoneDates,
  START_OF_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_YEAR: {
    [PANAMA_TIMEZONE]: '2026-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2026-01-01',
  } as TimezoneDates,
  START_OF_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2024-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2024-04-01',
  } as TimezoneDates,
  END_OF_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2025-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-04-01',
  } as TimezoneDates,
  START_OF_NEXT_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-06T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-06T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-05T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-06',
  } as TimezoneDates,
  END_OF_NEXT_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-13T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-13T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-12T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-13',
  } as TimezoneDates,
  START_OF_NEXT_MONTH: {
    [PANAMA_TIMEZONE]: '2025-02-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-02-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-02-01',
  } as TimezoneDates,
  END_OF_NEXT_MONTH: {
    [PANAMA_TIMEZONE]: '2025-03-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-03-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-02-28T15:00:00.000Z',
    [DATE_ONLY]: '2025-03-01',
  } as TimezoneDates,
  START_OF_NEXT_YEAR: {
    [PANAMA_TIMEZONE]: '2026-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2026-01-01',
  } as TimezoneDates,
  END_OF_NEXT_YEAR: {
    [PANAMA_TIMEZONE]: '2027-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2027-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2026-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2027-01-01',
  } as TimezoneDates,
  START_OF_NEXT_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2025-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-04-01',
  } as TimezoneDates,
  END_OF_NEXT_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2026-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2026-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2026-04-01',
  } as TimezoneDates,
  START_OF_NEXT_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T06:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T01:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T16:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_NEXT_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T08:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T03:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T18:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_NEXT_7_DAYS: {
    [PANAMA_TIMEZONE]: '2025-01-09T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-09T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-08T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-09',
  } as TimezoneDates,
  START_OF_NEXT_2_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_NEXT_2_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-03T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-03T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-02T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-03',
  } as TimezoneDates,
  START_OF_NEXT_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-30',
  } as TimezoneDates,
  END_OF_NEXT_2_WEEK: {
    [PANAMA_TIMEZONE]: '2025-01-13T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-12T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-12T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-12',
  } as TimezoneDates,
  START_OF_NEXT_2_MONTH: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_NEXT_2_MONTH: {
    [PANAMA_TIMEZONE]: '2025-03-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-02-28T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-02-28T15:00:00.000Z',
    [DATE_ONLY]: '2025-03-01',
  } as TimezoneDates,
  START_OF_NEXT_2_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  END_OF_NEXT_2_YEAR: {
    [PANAMA_TIMEZONE]: '2027-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2026-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2026-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2027-01-01',
  } as TimezoneDates,
  START_OF_LAST_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-23T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-23T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-22T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-23',
  } as TimezoneDates,
  END_OF_LAST_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-30',
  } as TimezoneDates,
  START_OF_LAST_7_DAYS: {
    [PANAMA_TIMEZONE]: '2024-12-25T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-25T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-24T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-25',
  } as TimezoneDates,
  END_OF_LAST_7_DAYS: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-02',
  } as TimezoneDates,
  START_OF_LAST_MONTH: {
    [PANAMA_TIMEZONE]: '2024-12-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-11-30T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-01',
  } as TimezoneDates,
  END_OF_LAST_MONTH: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  START_OF_LAST_YEAR: {
    [PANAMA_TIMEZONE]: '2024-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2023-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2024-01-01',
  } as TimezoneDates,
  END_OF_LAST_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  START_OF_LAST_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2023-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2023-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2023-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2023-04-01',
  } as TimezoneDates,
  END_OF_LAST_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2024-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2024-04-01',
  } as TimezoneDates,
  START_OF_LAST_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T04:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T23:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T14:00:00.000Z',
    [DATE_ONLY]: '2024-12-31',
  } as TimezoneDates,
  END_OF_LAST_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T06:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T01:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T16:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  START_OF_LAST_2_DAY: {
    [PANAMA_TIMEZONE]: '2024-12-30T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-29T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-30',
  } as TimezoneDates,
  END_OF_LAST_2_DAY: {
    [PANAMA_TIMEZONE]: '2025-01-02T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-02T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2025-01-01T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-02',
  } as TimezoneDates,
  START_OF_LAST_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-15T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-15T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-14T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-15',
  } as TimezoneDates,
  END_OF_LAST_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-29T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-28T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-28T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-29',
  } as TimezoneDates,
  START_OF_LAST_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-11-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-11-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-10-31T15:00:00.000Z',
    [DATE_ONLY]: '2024-11-01',
  } as TimezoneDates,
  END_OF_LAST_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-12-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-11-30T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-11-30T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-01',
  } as TimezoneDates,
  START_OF_LAST_2_YEAR: {
    [PANAMA_TIMEZONE]: '2023-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2023-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2022-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2023-01-01',
  } as TimezoneDates,
  END_OF_LAST_2_YEAR: {
    [PANAMA_TIMEZONE]: '2025-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2025-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2025-01-01',
  } as TimezoneDates,
  OLDER_2_HOUR: {
    [PANAMA_TIMEZONE]: '2025-01-01T04:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T23:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-31T14:00:00.000Z',
    [DATE_ONLY]: '2024-12-31',
  } as TimezoneDates,
  OLDER_2_DAY: {
    [PANAMA_TIMEZONE]: '2024-12-31T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-30T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-31',
  } as TimezoneDates,
  START_OF_OLDER_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-15T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-15T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-14T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-15',
  } as TimezoneDates,
  END_OF_OLDER_2_WEEK: {
    [PANAMA_TIMEZONE]: '2024-12-29T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-12-28T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-12-28T15:00:00.000Z',
    [DATE_ONLY]: '2024-12-29',
  } as TimezoneDates,
  START_OF_OLDER_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-10-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-10-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-09-30T15:00:00.000Z',
    [DATE_ONLY]: '2024-10-01',
  } as TimezoneDates,
  END_OF_OLDER_2_MONTH: {
    [PANAMA_TIMEZONE]: '2024-11-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2024-10-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2024-10-31T15:00:00.000Z',
    [DATE_ONLY]: '2024-11-01',
  } as TimezoneDates,
  START_OF_OLDER_2_YEAR: {
    [PANAMA_TIMEZONE]: '2022-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2022-01-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2021-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2022-01-01',
  } as TimezoneDates,
  END_OF_OLDER_2_YEAR: {
    [PANAMA_TIMEZONE]: '2024-01-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2023-12-31T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2023-12-31T15:00:00.000Z',
    [DATE_ONLY]: '2024-01-01',
  } as TimezoneDates,
  START_OF_2027_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2027-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2027-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2027-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2027-04-01',
  } as TimezoneDates,
  END_OF_2027_FISCAL_YEAR: {
    [PANAMA_TIMEZONE]: '2028-04-01T05:00:00.000Z',
    [UTC_TIMEZONE]: '2028-04-01T00:00:00.000Z',
    [TOKYO_TIMEZONE]: '2028-03-31T15:00:00.000Z',
    [DATE_ONLY]: '2028-04-01',
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

const sequelize = {
  getDialect: vi.fn(),
} as unknown as Sequelize;

const schemaStore = new SequelizeSchemaStore({
  sequelize,
});

const defaultOptions = {
  timezone,
  sequelize,
  schemaStore,
};

describe('conditions', () => {
  beforeEach(() => {
    vi.mocked(sequelize.getDialect).mockReturnValue('postgres');
  });

  describe.each([
    ['lt', Op.lt],
    ['lte', Op.lte],
    ['gt', Op.gt],
    ['gte', Op.gte],
  ])('%s', (operator, symbol) => {
    it('number', () => {
      const condition: Condition = {
        field: 'age',
        operator: operator as OperatorKey,
        value: 18,
      };
      const result = transformCondition(
        condition,
        attributes.integer,
        defaultOptions
      );
      expect(result).toEqual({
        age: {
          [symbol]: 18,
        },
      });
    });
  });

  describe.each([
    ['like', '%John%'],
    ['begins-with', 'John%'],
    ['ends-with', '%John'],
  ])('%s', (operator, expectedValue) => {
    describe('string', () => {
      it('postgres', () => {
        const condition: Condition = {
          field: 'name',
          operator: operator as OperatorKey,
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.iLike]: expectedValue,
          },
        });
      });

      it('sqlite', () => {
        vi.mocked(sequelize.getDialect).mockReturnValue('sqlite');
        const condition: Condition = {
          field: 'name',
          operator: operator as OperatorKey,
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.like]: expectedValue,
          },
        });
      });
    });
  });

  describe.each([
    ['not-like', '%John%'],
    ['not-begin-with', 'John%'],
    ['not-end-with', '%John'],
  ])('%s', (operator, expectedValue) => {
    describe('string', () => {
      it('postgres', () => {
        const condition: Condition = {
          field: 'name',
          operator: operator as OperatorKey,
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.notILike]: expectedValue,
          },
        });
      });

      it('sqlite', () => {
        vi.mocked(sequelize.getDialect).mockReturnValue('sqlite');
        const condition: Condition = {
          field: 'name',
          operator: operator as OperatorKey,
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.notLike]: expectedValue,
          },
        });
      });
    });
  });

  describe.each([
    [
      'on',
      '2025-01-01',
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_DAY[timezone],
        [Op.lt]: dates.END_OF_DAY[timezone],
      }),
    ],
    [
      'on-or-after',
      '2025-01-01',
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_DAY[timezone],
      }),
    ],
    [
      'on-or-before',
      '2025-01-01',
      (timezone: string) => ({
        [Op.lt]: dates.END_OF_DAY[timezone],
      }),
    ],
    [
      'this-month',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_MONTH[timezone],
        [Op.lt]: dates.END_OF_MONTH[timezone],
      }),
    ],
    [
      'today',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_DAY[timezone],
        [Op.lt]: dates.END_OF_DAY[timezone],
      }),
    ],
    [
      'yesterday',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_YESTERDAY[timezone],
        [Op.lt]: dates.END_OF_YESTERDAY[timezone],
      }),
    ],
    [
      'tomorrow',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_TOMORROW[timezone],
        [Op.lt]: dates.END_OF_TOMORROW[timezone],
      }),
    ],
    [
      'this-week',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_WEEK[timezone],
        [Op.lt]: dates.END_OF_WEEK[timezone],
      }),
    ],
    [
      'this-year',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_YEAR[timezone],
        [Op.lt]: dates.END_OF_YEAR[timezone],
      }),
    ],
    [
      'this-fiscal-year',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_FISCAL_YEAR[timezone],
        [Op.lt]: dates.END_OF_FISCAL_YEAR[timezone],
      }),
    ],
    [
      'next-week',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_NEXT_WEEK[timezone],
        [Op.lt]: dates.END_OF_NEXT_WEEK[timezone],
      }),
    ],
    [
      'next-seven-days',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_DAY[timezone],
        [Op.lt]: dates.END_OF_NEXT_7_DAYS[timezone],
      }),
    ],
    [
      'next-month',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_NEXT_MONTH[timezone],
        [Op.lt]: dates.END_OF_NEXT_MONTH[timezone],
      }),
    ],
    [
      'next-year',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_NEXT_YEAR[timezone],
        [Op.lt]: dates.END_OF_NEXT_YEAR[timezone],
      }),
    ],
    [
      'next-fiscal-year',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_NEXT_FISCAL_YEAR[timezone],
        [Op.lt]: dates.END_OF_NEXT_FISCAL_YEAR[timezone],
      }),
    ],
    [
      'next-x-hours',
      2,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_NEXT_2_HOUR[timezone],
        [Op.lt]: dates.END_OF_NEXT_2_HOUR[timezone],
      }),
    ],
    [
      'next-x-days',
      2,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_NEXT_2_DAY[timezone],
        [Op.lt]: dates.END_OF_NEXT_2_DAY[timezone],
      }),
    ],
    [
      'last-week',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_WEEK[timezone],
        [Op.lt]: dates.END_OF_LAST_WEEK[timezone],
      }),
    ],
    [
      'last-seven-days',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_7_DAYS[timezone],
        [Op.lt]: dates.END_OF_LAST_7_DAYS[timezone],
      }),
    ],
    [
      'last-month',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_MONTH[timezone],
        [Op.lt]: dates.END_OF_LAST_MONTH[timezone],
      }),
    ],
    [
      'last-year',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_YEAR[timezone],
        [Op.lt]: dates.END_OF_LAST_YEAR[timezone],
      }),
    ],
    [
      'last-fiscal-year',
      null,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_FISCAL_YEAR[timezone],
        [Op.lt]: dates.END_OF_LAST_FISCAL_YEAR[timezone],
      }),
    ],
    [
      'last-x-hours',
      2,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_2_HOUR[timezone],
        [Op.lt]: dates.END_OF_LAST_2_HOUR[timezone],
      }),
    ],
    [
      'last-x-days',
      2,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_LAST_2_DAY[timezone],
        [Op.lt]: dates.END_OF_LAST_2_DAY[timezone],
      }),
    ],
    [
      'olderthan-x-hours',
      2,
      (timezone: string) => ({
        [Op.lte]: dates.OLDER_2_HOUR[timezone],
      }),
    ],
    [
      'olderthan-x-days',
      2,
      (timezone: string) => ({
        [Op.lt]: dates.OLDER_2_DAY[timezone],
      }),
    ],
    [
      'in-fiscal-year',
      2027,
      (timezone: string) => ({
        [Op.gte]: dates.START_OF_2027_FISCAL_YEAR[timezone],
        [Op.lt]: dates.END_OF_2027_FISCAL_YEAR[timezone],
      }),
    ],
  ])('%s', (operator, value, expectedFn) => {
    describe.each([
      PANAMA_TIMEZONE,
      UTC_TIMEZONE,
      TOKYO_TIMEZONE,
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
          ...defaultOptions,
          timezone,
        });
        expect(result).toEqual({
          createdAt: expectedFn(DATE_ONLY),
        });
      });

      it('datetime', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: operator as OperatorKey,
          value: value,
        };
        const result = transformCondition(condition, attributes.datetime, {
          ...defaultOptions,
          timezone,
        });
        expect(result).toEqual({
          createdAt: expectedFn(timezone),
        });
      });
    });
  });

  describe('eq', () => {
    describe('string', () => {
      it('postgres', () => {
        const condition: Condition = {
          field: 'name',
          operator: 'eq',
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.iLike]: 'John',
          },
        });
      });

      it('sqlite', () => {
        vi.mocked(sequelize.getDialect).mockReturnValue('sqlite');
        const condition: Condition = {
          field: 'name',
          operator: 'eq',
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.like]: 'John',
          },
        });
      });
    });

    it('other', () => {
      const condition: Condition = {
        field: 'age',
        operator: 'eq',
        value: 5,
      };
      const result = transformCondition(
        condition,
        attributes.number,
        defaultOptions
      );
      expect(result).toEqual({
        age: 5,
      });
    });
  });

  describe('ne', () => {
    describe('string', () => {
      it('postgres', () => {
        const condition: Condition = {
          field: 'name',
          operator: 'ne',
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.notILike]: 'John',
          },
        });
      });

      it('sqlite', () => {
        vi.mocked(sequelize.getDialect).mockReturnValue('sqlite');
        const condition: Condition = {
          field: 'name',
          operator: 'ne',
          value: 'John',
        };
        const result = transformCondition(
          condition,
          attributes.string,
          defaultOptions
        );
        expect(result).toEqual({
          name: {
            [Op.notLike]: 'John',
          },
        });
      });
    });

    it('other', () => {
      const condition: Condition = {
        field: 'age',
        operator: 'ne',
        value: 5,
      };
      const result = transformCondition(
        condition,
        attributes.number,
        defaultOptions
      );
      expect(result).toEqual({
        age: {
          [Op.ne]: 5,
        },
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

        const result = transformCondition(
          condition,
          attributes.date,
          defaultOptions
        );

        expect(result).toEqual({
          createdAt: {
            [Op.between]: ['2025-01-01', '2025-01-01'],
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

        const result = transformCondition(
          condition,
          attributes.datetime,
          defaultOptions
        );

        expect(result).toEqual({
          createdAt: {
            [Op.gte]: '2024-12-31T15:00:00.000Z',
            [Op.lt]: '2025-01-01T15:00:00.000Z',
          },
        });
      });

      it('input has date and time', () => {
        const condition: Condition = {
          field: 'createdAt',
          operator: 'between',
          value: ['2025-01-01T04:00:00.000Z', '2025-01-01T06:00:00.000Z'],
        };

        const result = transformCondition(
          condition,
          attributes.datetime,
          defaultOptions
        );

        expect(result).toEqual({
          createdAt: {
            [Op.between]: [
              '2025-01-01T04:00:00.000Z',
              '2025-01-01T06:00:00.000Z',
            ],
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

      const result = transformCondition(
        condition,
        attributes.number,
        defaultOptions
      );

      expect(result).toEqual({
        age: {
          [Op.between]: [4, 9],
        },
      });
    });

    it('money', () => {
      const condition: Condition = {
        field: 'age',
        operator: 'between',
        value: [450, 950],
      };

      const result = transformCondition(
        condition,
        attributes.money,
        defaultOptions
      );

      expect(result).toEqual({
        age: {
          [Op.between]: [450, 950],
        },
      });
    });

    it('null for other types', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'between',
        value: ['John', 'Doe'],
      };
      const result = transformCondition(
        condition,
        attributes.string,
        defaultOptions
      );
      expect(result).toBeNull();
    });
  });

  it('not-null', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'not-null',
      value: null,
    };
    const result = transformCondition(
      condition,
      attributes.string,
      defaultOptions
    );
    expect(result).toEqual({
      name: {
        [Op.ne]: null,
      },
    });
  });

  it('null', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'null',
      value: null,
    };
    const result = transformCondition(
      condition,
      attributes.string,
      defaultOptions
    );
    expect(result).toEqual({
      name: {
        [Op.eq]: null,
      },
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
        transformCondition(condition, attributes.string, defaultOptions);
      }).toThrow('Value for "in" operator must be an array');
    });

    it('should throw an error if value is empty', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'in',
        value: [],
      };
      expect(() => {
        transformCondition(condition, attributes.string, defaultOptions);
      }).toThrow('Value for "in" operator cannot be an empty array');
    });

    describe('boolean', () => {
      it('valid input', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'in',
          value: [true, false],
        };

        const result = transformCondition(
          condition,
          attributes.boolean,
          defaultOptions
        );

        expect(result).toEqual({
          [Op.or]: [
            { isActive: { [Op.eq]: true } },
            {
              [Op.or]: [
                { isActive: { [Op.eq]: false } },
                { isActive: { [Op.eq]: null } },
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
          transformCondition(condition, attributes.boolean, defaultOptions);
        }).toThrow('Invalid value for boolean type');
      });
    });

    it('choice', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(
        condition,
        attributes.choice,
        defaultOptions
      );
      expect(result).toEqual({
        status: {
          [Op.in]: ['active', 'inactive'],
        },
      });
    });

    it('choices', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(
        condition,
        attributes.choices,
        defaultOptions
      );
      expect(result).toEqual({
        status: {
          [Op.in]: ['active', 'inactive'],
        },
      });
    });

    it('id', () => {
      const condition: Condition = {
        field: 'parent',
        operator: 'in',
        value: ['abc', 'def'],
      };
      const result = transformCondition(
        condition,
        attributes.idString,
        defaultOptions
      );
      expect(result).toEqual({
        parent: {
          [Op.in]: ['abc', 'def'],
        },
      });
    });

    it('lookup', () => {
      const condition: Condition = {
        field: 'parent',
        operator: 'in',
        value: ['abc', 'def'],
      };
      const result = transformCondition(
        condition,
        attributes.lookupString,
        defaultOptions
      );
      expect(result).toEqual({
        parent: {
          [Op.in]: ['abc', 'def'],
        },
      });
    });

    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'in',
        value: ['John', 'Doe'],
      };
      const result = transformCondition(
        condition,
        attributes.string,
        defaultOptions
      );
      expect(result).toEqual({
        name: {
          [Op.in]: ['John', 'Doe'],
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
        transformCondition(condition, attributes.date, defaultOptions);
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
        transformCondition(condition, attributes.string, defaultOptions);
      }).toThrow('Value for "not-in" operator must be an array');
    });

    it('should throw an error if value is empty', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-in',
        value: [],
      };
      expect(() => {
        transformCondition(condition, attributes.string, defaultOptions);
      }).toThrow('Value for "not-in" operator cannot be an empty array');
    });

    describe('boolean', () => {
      it('[true]', () => {
        const condition: Condition = {
          field: 'isActive',
          operator: 'not-in',
          value: [true],
        };

        const result = transformCondition(
          condition,
          attributes.boolean,
          defaultOptions
        );
        expect(result).toEqual({
          [Op.and]: [
            {
              [Op.or]: [
                {
                  isActive: { [Op.eq]: false },
                },
                {
                  isActive: { [Op.eq]: null },
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

        const result = transformCondition(
          condition,
          attributes.boolean,
          defaultOptions
        );

        expect(result).toEqual({
          [Op.and]: [
            {
              isActive: { [Op.eq]: true },
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

        const result = transformCondition(
          condition,
          attributes.boolean,
          defaultOptions
        );

        expect(result).toEqual({
          [Op.and]: [
            {
              [Op.or]: [
                {
                  isActive: { [Op.eq]: false },
                },
                {
                  isActive: { [Op.eq]: null },
                },
              ],
            },
            { isActive: { [Op.eq]: true } },
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
          transformCondition(condition, attributes.boolean, defaultOptions);
        }).toThrow('Invalid value for boolean type');
      });
    });

    it('choice', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'not-in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(
        condition,
        attributes.choice,
        defaultOptions
      );
      expect(result).toEqual({
        status: {
          [Op.notIn]: ['active', 'inactive'],
        },
      });
    });

    it('choices', () => {
      const condition: Condition = {
        field: 'status',
        operator: 'not-in',
        value: ['active', 'inactive'],
      };
      const result = transformCondition(
        condition,
        attributes.choices,
        defaultOptions
      );
      expect(result).toEqual({
        status: {
          [Op.notIn]: ['active', 'inactive'],
        },
      });
    });

    it('id', () => {
      const condition: Condition = {
        field: 'parent',
        operator: 'not-in',
        value: ['abc', 'def'],
      };
      const result = transformCondition(
        condition,
        attributes.idString,
        defaultOptions
      );
      expect(result).toEqual({
        parent: {
          [Op.notIn]: ['abc', 'def'],
        },
      });
    });

    it('lookup', () => {
      const condition: Condition = {
        field: 'parent',
        operator: 'not-in',
        value: ['abc', 'def'],
      };
      const result = transformCondition(
        condition,
        attributes.lookupString,
        defaultOptions
      );
      expect(result).toEqual({
        parent: {
          [Op.notIn]: ['abc', 'def'],
        },
      });
    });

    it('string', () => {
      const condition: Condition = {
        field: 'name',
        operator: 'not-in',
        value: ['John', 'Doe'],
      };
      const result = transformCondition(
        condition,
        attributes.string,
        defaultOptions
      );
      expect(result).toEqual({
        name: {
          [Op.notIn]: ['John', 'Doe'],
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
        transformCondition(condition, attributes.date, defaultOptions);
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

    const result = transformCondition(
      condition,
      attributes.string,
      defaultOptions
    );
    expect(result).toBeNull();
  });

  it('should throw any error if attribute is null', () => {
    const condition: Condition = {
      field: 'name',
      operator: 'eq',
      value: 'John',
    } as any;
    expect(() => {
      transformCondition(condition, null as any, defaultOptions);
    }).toThrow('Attribute not found: name');
  });
});

describe('transformFilter', () => {
  const schema = defineSchema({
    attributes,
  } as any) as any;

  it('should return null for nullish filter', () => {
    const result = transformFilter(null, schema, defaultOptions);
    expect(result).toBeNull();
  });

  it('should return null for empty filter', () => {
    const result = transformFilter(
      { type: 'and', conditions: [] } as any,
      schema,
      defaultOptions
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
    const result = transformFilter(filter, schema, defaultOptions);
    expect(result).toEqual({
      [Op.and]: [
        {
          string: {
            [Op.iLike]: 'John',
          },
        },
        {
          number: {
            [Op.gt]: 18,
          },
        },
        {
          [Op.or]: [
            {
              choice: {
                [Op.in]: ['active', 'inactive'],
              },
            },
            {
              date: {
                [Op.between]: ['2025-01-01', '2025-01-01'],
              },
            },
          ],
        },
      ],
    });
  });
});
