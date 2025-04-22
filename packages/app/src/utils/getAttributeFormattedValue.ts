import {
  Attribute,
  BooleanAttribute,
  ChoiceAttribute,
  DataLookup,
  DateAttribute,
  InferredAttributeType,
  NumberAttribute,
} from '@headless-adminapp/core/attributes';
import { FileObject } from '@headless-adminapp/core/attributes/AttachmentAttribute';
import { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { parsePhoneNumber } from './phone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface AttributeFormattedValueStringsSet {
  yes: string;
  no: string;
}

const defaultAttributeFormattedValueStrings: AttributeFormattedValueStringsSet =
  {
    yes: 'Yes',
    no: 'No',
  };

const defaultDateFormat = 'YYYY-MM-DD';
const defaultTimeFormat = 'HH:mm';
const defaultLocale = 'en-US';
const defaultCurrency = 'USD';
const defaultCurrencySign = 'accounting';
const defaultCurrencyDisplay = 'symbol';

function getAttributeLookupsFormattedValue(
  value: unknown,
  options?: {
    maxCount?: number;
  }
) {
  const items = (value as unknown as DataLookup<string>[])?.map((v) => v.name);

  if (options?.maxCount && items?.length > options.maxCount) {
    return (
      items.slice(0, options.maxCount).join(', ') +
      ` (+${items.length - options.maxCount})`
    );
  } else {
    return items?.join(', ');
  }
}

function getAttributeAttachmentFormattedValue(value: unknown) {
  return (value as FileObject)?.url ?? null;
}

function getAttributeDateFormattedValue(
  attribute: DateAttribute,
  value: unknown,
  options?: { dateFormat?: string; timeFormat?: string; timezone?: string }
) {
  const dateFormat = options?.dateFormat ?? defaultDateFormat;
  const timeFormat = options?.timeFormat ?? defaultTimeFormat;

  if (attribute.format === 'datetime') {
    return dayjs(value as string)
      .tz(options?.timezone)
      .format(dateFormat + ' ' + timeFormat);
  } else {
    return dayjs(value as string)
      .tz(options?.timezone)
      .format(dateFormat);
  }
}

function getAttributeDateRangeFormattedValue(
  value: unknown,
  options?: { dateFormat?: string; timezone?: string }
) {
  if (!value) return null;

  const dateFormat = options?.dateFormat ?? defaultDateFormat;

  const from = (value as string[])[0];
  const to = (value as string[])[1];

  if (!from && !to) {
    return null;
  }

  if (from && to) {
    return (
      dayjs(from).tz(options?.timezone).format(dateFormat) +
      ' - ' +
      dayjs(to).tz(options?.timezone).format(dateFormat)
    );
  }

  if (from) {
    return 'After ' + dayjs(from).tz(options?.timezone).format(dateFormat);
  }

  if (to) {
    return 'Before ' + dayjs(to).tz(options?.timezone).format(dateFormat);
  }

  return null;
}

function getAttributeBooleanFormattedValue(
  attribute: BooleanAttribute,
  value: unknown,
  options?: {
    strings?: AttributeFormattedValueStringsSet;
  }
) {
  const strings = options?.strings ?? defaultAttributeFormattedValueStrings;

  return value
    ? attribute.trueLabel ?? strings.yes
    : attribute.falseLabel ?? strings.no;
}

function getAttributeChoiceFormattedValue(
  attribute: ChoiceAttribute<string | number>,
  value: unknown
) {
  return (
    attribute.options.find((option) => option.value === value) ?? {
      label: '',
    }
  ).label;
}

function getAttributeChoicesFormattedValue(
  attribute: ChoicesAttribute<string | number>,
  value: unknown
) {
  return (value as string[])
    .map((v) => {
      return (
        attribute.options.find((option) => option.value === v) ?? {
          label: '',
        }
      ).label;
    })
    .join(', ');
}

function getAttributeLookupFormattedValue(value: unknown) {
  return (value as DataLookup<string>)?.name;
}

function getAttributeRegardingFormattedValue(value: unknown) {
  return (value as DataLookup<string>)?.name;
}

function getAttributeMoneyFormattedValue(
  value: unknown,
  options?: {
    locale?: string;
    currency?: string;
    currencySign?: 'accounting' | 'standard';
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code';
  }
) {
  const locale = options?.locale ?? defaultLocale;

  const currency = options?.currency ?? defaultCurrency;
  const currencySign = options?.currencySign ?? defaultCurrencySign;
  const currencyDisplay = options?.currencyDisplay ?? defaultCurrencyDisplay;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencySign,
    currencyDisplay,
  }).format(value as number);
}

function getAttributeNumberFormattedValue(
  attribute: NumberAttribute,
  value: unknown,
  options?: {
    locale?: string;
    currency?: string;
    currencySign?: 'accounting' | 'standard';
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code';
    timeFormat?: string;
  }
) {
  if (attribute.format === 'duration') {
    return formatDuration(value as number);
  }

  if (attribute.format === 'time') {
    return dayjs()
      .startOf('day')
      .add(value as number, 'minutes')
      .format(options?.timeFormat ?? defaultTimeFormat);
  }

  return new Intl.NumberFormat(options?.locale).format(value as number);
}

export function formatDuration(value: number | null) {
  if (!value) {
    return '';
  }

  // No decimal, if value is decimal, round to nearest whole number
  // 1 - 1 minute
  // 2-59 minutes -> 2-59 minutes
  // 90 minutes -> 1.5 hours
  // more than a day -> 1 day, 1.5 days, 2 days, etc.

  // check if value has decimal
  if (value % 1 !== 0) {
    // round to nearest whole number
    value = Math.round(value);
  }

  if (!value) {
    return '';
  }

  if (value === 1) {
    return '1 minute';
  }

  if (value < 60) {
    return `${value} minutes`;
  }

  if (value === 60) {
    return '1 hour';
  }

  if (value < 1440) {
    return `${Number((value / 60).toFixed(2))} hours`;
  }

  if (value === 1440) {
    return '1 day';
  }

  return `${Number((value / 1440).toFixed(2))} days`;
}

export function getAttributeFormattedValue<A extends Attribute = Attribute>(
  attribute: Attribute,
  value: InferredAttributeType<A> | null | undefined,
  options?: {
    maxCount?: number; // for choices and lookups
    strings?: AttributeFormattedValueStringsSet;
    dateFormat?: string;
    timeFormat?: string;
    locale?: string;
    currency?: string;
    currencySign?: 'accounting' | 'standard';
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code';
    timezone?: string;
    region?: string;
  }
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const region = options?.region ?? 'US';

  switch (attribute.type) {
    case 'boolean':
      return getAttributeBooleanFormattedValue(attribute, value, options);
    case 'choice':
      return getAttributeChoiceFormattedValue(attribute, value);
    case 'choices':
      return getAttributeChoicesFormattedValue(attribute, value);
    case 'date':
      return getAttributeDateFormattedValue(attribute, value, options);
    case 'daterange':
      return getAttributeDateRangeFormattedValue(value, options);
    case 'lookup':
      return getAttributeLookupFormattedValue(value);
    case 'lookups':
      return getAttributeLookupsFormattedValue(value, options);
    case 'regarding':
      return getAttributeRegardingFormattedValue(value);
    case 'money':
      return getAttributeMoneyFormattedValue(value, options);
    case 'number':
      return getAttributeNumberFormattedValue(attribute, value, options);
    case 'attachment':
      return getAttributeAttachmentFormattedValue(value);
    case 'string':
      if (attribute.format === 'phone' && typeof value === 'string') {
        return parsePhoneNumber(value, region).formattedNationalValue;
      }
      return typeof value === 'object'
        ? JSON.stringify(value)
        : (value as string);
    default:
      return typeof value === 'object'
        ? JSON.stringify(value)
        : (value as string);
  }
}
