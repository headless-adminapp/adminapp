import type { AttributeType } from '@headless-adminapp/core/attributes';

import { OperatorOptionConfig, OperatorStrings } from './types';

export const defaultOperatorStrings: OperatorStrings = {
  equals: 'Equals',
  doesNotEqual: 'Does not equal',
  contains: 'Contains',
  doesNotContain: 'Does not contain',
  beginsWith: 'Begins with',
  doesNotBeginWith: 'Does not begin with',
  endsWith: 'Ends with',
  doesNotEndWith: 'Does not end with',
  containsData: 'Contains data',
  doesNotContainData: 'Does not contain data',
  greaterThan: 'Greater than',
  greaterThanOrEquals: 'Greater than or equals',
  lessThan: 'Less than',
  lessThanOrEquals: 'Less than or equals',
  between: 'Between',
  on: 'On',
  onOrAfter: 'On or after',
  onOrBefore: 'On or before',
  today: 'Today',
  yesterday: 'Yesterday',
  tomorrow: 'Tomorrow',
  thisWeek: 'This week',
  thisMonth: 'This month',
  thisYear: 'This year',
  thisFiscalYear: 'This fiscal year',
  nextWeek: 'Next week',
  nextSevenDays: 'Next 7 days',
  nextMonth: 'Next month',
  nextYear: 'Next year',
  nextFiscalYear: 'Next fiscal year',
  nextXHours: 'Next X hours',
  nextXDays: 'Next X days',
  nextXWeeks: 'Next X weeks',
  nextXMonths: 'Next X months',
  nextXYears: 'Next X years',
  lastWeek: 'Last week',
  lastSevenDays: 'Last 7 days',
  lastMonth: 'Last month',
  lastYear: 'Last year',
  lastFiscalYear: 'Last fiscal year',
  lastXHours: 'Last X hours',
  lastXDays: 'Last X days',
  lastXWeeks: 'Last X weeks',
  lastXMonths: 'Last X months',
  lastXYears: 'Last X years',
  olderthanXHours: 'Older than X hours',
  olderthanXDays: 'Older than X days',
  olderthanXWeeks: 'Older than X weeks',
  olderthanXMonths: 'Older than X months',
  olderthanXYears: 'Older than X years',
  inFiscalYear: 'In fiscal year',
};

const stringOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'eq',
    labelKey: 'equals',
    controls: ['string'],
  },
  {
    value: 'ne',
    labelKey: 'doesNotEqual',
    controls: ['string'],
  },
  {
    value: 'like',
    labelKey: 'contains',
    controls: ['string'],
  },
  {
    value: 'not-like',
    labelKey: 'doesNotContain',
    controls: ['string'],
  },
  {
    value: 'begins-with',
    labelKey: 'beginsWith',
    controls: ['string'],
  },
  {
    value: 'not-begin-with',
    labelKey: 'doesNotBeginWith',
    controls: ['string'],
  },
  {
    value: 'ends-with',
    labelKey: 'endsWith',
    controls: ['string'],
  },
  {
    value: 'not-end-with',
    labelKey: 'doesNotEndWith',
    controls: ['string'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const numberOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'eq',
    labelKey: 'equals',
    controls: ['number'],
  },
  {
    value: 'ne',
    labelKey: 'doesNotEqual',
    controls: ['number'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
  {
    value: 'gt',
    labelKey: 'greaterThan',
    controls: ['number'],
  },
  {
    value: 'gte',
    labelKey: 'greaterThanOrEquals',
    controls: ['number'],
  },
  {
    value: 'lt',
    labelKey: 'lessThan',
    controls: ['number'],
  },
  {
    value: 'lte',
    labelKey: 'lessThanOrEquals',
    controls: ['number'],
  },
  {
    value: 'between',
    labelKey: 'between',
    controls: ['number', 'number'],
  },
];

const moneyOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'eq',
    labelKey: 'equals',
    controls: ['money'],
  },
  {
    value: 'ne',
    labelKey: 'doesNotEqual',
    controls: ['money'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
  {
    value: 'gt',
    labelKey: 'greaterThan',
    controls: ['money'],
  },
  {
    value: 'gte',
    labelKey: 'greaterThanOrEquals',
    controls: ['money'],
  },
  {
    value: 'lt',
    labelKey: 'lessThan',
    controls: ['money'],
  },
  {
    value: 'lte',
    labelKey: 'lessThanOrEquals',
    controls: ['money'],
  },
  {
    value: 'between',
    labelKey: 'between',
    controls: ['money', 'money'],
  },
];

const dateOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'on',
    labelKey: 'on',
    controls: ['date'],
  },
  {
    value: 'on-or-after',
    labelKey: 'onOrAfter',
    controls: ['date'],
  },
  {
    value: 'on-or-before',
    labelKey: 'onOrBefore',
    controls: ['date'],
  },
  {
    value: 'today',
    labelKey: 'today',
    controls: [],
  },
  {
    value: 'yesterday',
    labelKey: 'yesterday',
    controls: [],
  },
  {
    value: 'tomorrow',
    labelKey: 'tomorrow',
    controls: [],
  },
  {
    value: 'this-week',
    labelKey: 'thisWeek',
    controls: [],
  },
  {
    value: 'this-month',
    labelKey: 'thisMonth',
    controls: [],
  },
  {
    value: 'this-year',
    labelKey: 'thisYear',
    controls: [],
  },
  {
    value: 'this-fiscal-year',
    labelKey: 'thisFiscalYear',
    controls: [],
  },
  {
    value: 'next-week',
    labelKey: 'nextWeek',
    controls: [],
  },
  {
    value: 'next-seven-days',
    labelKey: 'nextSevenDays',
    controls: [],
  },
  {
    value: 'next-month',
    labelKey: 'nextMonth',
    controls: [],
  },
  {
    value: 'next-year',
    labelKey: 'nextYear',
    controls: [],
  },
  {
    value: 'next-fiscal-year',
    labelKey: 'nextFiscalYear',
    controls: [],
  },
  {
    value: 'next-x-hours',
    labelKey: 'nextXHours',
    controls: [],
  },
  {
    value: 'next-x-days',
    labelKey: 'nextXDays',
    controls: [],
  },
  {
    value: 'last-week',
    labelKey: 'lastWeek',
    controls: [],
  },
  {
    value: 'last-seven-days',
    labelKey: 'lastSevenDays',
    controls: [],
  },
  {
    value: 'last-month',
    labelKey: 'lastMonth',
    controls: [],
  },
  {
    value: 'last-year',
    labelKey: 'lastYear',
    controls: [],
  },
  {
    value: 'last-fiscal-year',
    labelKey: 'lastFiscalYear',
    controls: [],
  },
  {
    value: 'last-x-hours',
    labelKey: 'lastXHours',
    controls: ['number'],
  },
  {
    value: 'last-x-days',
    labelKey: 'lastXDays',
    controls: ['number'],
  },
  {
    value: 'olderthan-x-hours',
    labelKey: 'olderthanXHours',
    controls: ['number'],
  },
  {
    value: 'olderthan-x-days',
    labelKey: 'olderthanXDays',
    controls: ['number'],
  },
  {
    value: 'in-fiscal-year',
    labelKey: 'inFiscalYear',
    controls: ['number'],
  },
  {
    value: 'between',
    labelKey: 'between',
    controls: ['date', 'date'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const choiceOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'in',
    labelKey: 'equals',
    controls: ['choice'],
  },
  {
    value: 'not-in',
    labelKey: 'doesNotEqual',
    controls: ['choice'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const lookupOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'in',
    labelKey: 'equals',
    controls: ['lookup'],
  },
  {
    value: 'not-in',
    labelKey: 'doesNotEqual',
    controls: ['lookup'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const regardingOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'in',
    labelKey: 'equals',
    controls: ['regarding'],
  },
  {
    value: 'not-in',
    labelKey: 'doesNotEqual',
    controls: ['regarding'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const booleanOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'in',
    labelKey: 'equals',
    controls: ['boolean'],
  },
  {
    value: 'not-in',
    labelKey: 'doesNotEqual',
    controls: ['boolean'],
  },
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const idOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const attachmentOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

const mixedOperatorOptions: OperatorOptionConfig[] = [
  {
    value: 'not-null',
    labelKey: 'containsData',
    controls: [],
  },
  {
    value: 'null',
    labelKey: 'doesNotContainData',
    controls: [],
  },
];

export const operatorOptions: Record<AttributeType, OperatorOptionConfig[]> = {
  id: idOperatorOptions,
  boolean: booleanOperatorOptions,
  choice: choiceOperatorOptions,
  choices: choiceOperatorOptions,
  date: dateOperatorOptions,
  lookup: lookupOperatorOptions,
  money: moneyOperatorOptions,
  number: numberOperatorOptions,
  string: stringOperatorOptions,
  attachment: attachmentOperatorOptions,
  attachments: [],
  mixed: mixedOperatorOptions,
  daterange: [],
  lookups: [],
  regarding: regardingOperatorOptions,
};
