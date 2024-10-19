import type { AttributeType } from '@headless-adminapp/core/attributes';
import type { OperatorKey } from '@headless-adminapp/core/transport';

export interface OperatorStrings {
  equals: string;
  doesNotEqual: string;
  contains: string;
  doesNotContain: string;
  beginsWith: string;
  doesNotBeginWith: string;
  endsWith: string;
  doesNotEndWith: string;
  containsData: string;
  doesNotContainData: string;
  greaterThan: string;
  greaterThanOrEquals: string;
  lessThan: string;
  lessThanOrEquals: string;
  between: string;
  on: string;
  onOrAfter: string;
  onOrBefore: string;
  today: string;
  yesterday: string;
  tomorrow: string;
  thisWeek: string;
  thisMonth: string;
  thisYear: string;
  thisFiscalYear: string;
  nextWeek: string;
  nextSevenDays: string;
  nextMonth: string;
  nextYear: string;
  nextFiscalYear: string;
  nextXHours: string;
  nextXDays: string;
  nextXWeeks: string;
  nextXMonths: string;
  nextXYears: string;
  lastWeek: string;
  lastSevenDays: string;
  lastMonth: string;
  lastYear: string;
  lastFiscalYear: string;
  lastXHours: string;
  lastXDays: string;
  lastXWeeks: string;
  lastXMonths: string;
  lastXYears: string;
  olderthanXHours: string;
  olderthanXDays: string;
  olderthanXWeeks: string;
  olderthanXMonths: string;
  olderthanXYears: string;
  inFiscalYear: string;
}

export type OperatorOptionConfig = {
  value: OperatorKey;
  labelKey: keyof OperatorStrings;
  controls: AttributeType[];
};

export type OperatorOption = {
  value: OperatorKey;
  label: string;
  controls: AttributeType[];
};
