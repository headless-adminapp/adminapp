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
import { Locale } from '@headless-adminapp/core/experience/locale/types';
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

export function getAttributeLookupsFormattedValue(
  value: unknown,
  options?: {
    maxCount?: number;
  }
) {
  const items = (value as DataLookup<string>[])?.map((v) => v.name);

  if (options?.maxCount && items?.length > options.maxCount) {
    return (
      items.slice(0, options.maxCount).join(', ') +
      ` (+${items.length - options.maxCount})`
    );
  } else {
    return items?.join(', ');
  }
}

export function getAttributeAttachmentFormattedValue(value: unknown) {
  const name = (value as FileObject)?.name;
  const url = (value as FileObject)?.url;

  if (name) {
    return name;
  }

  if (url) {
    return url;
  }

  return null;
}

export function getAttributeDateFormattedValue(
  attribute: DateAttribute,
  value: unknown,
  locale: Locale
) {
  if (attribute.format === 'datetime') {
    return dayjs(value as string)
      .tz(locale?.timezone)
      .format(locale.dateFormats.short + ' ' + locale.timeFormats.short);
  } else {
    return dayjs(value as string).format(locale.dateFormats.short);
  }
}

export function getAttributeDateRangeFormattedValue(
  value: unknown,
  locale: Locale
) {
  if (!value) {
    return '';
  }

  if (!Array.isArray(value) || value.length !== 2) {
    return '';
  }

  if (!value[0] || !value[1]) {
    return '';
  }

  const dateRangeFormat = locale.dateRangeFormats.short;

  const [start, end] = value.map((date) => dayjs(date));

  if (start.isSame(end, 'year')) {
    if (start.isSame(end, 'month')) {
      if (start.isSame(end, 'day')) {
        return start.format(dateRangeFormat.date);
      } else {
        return (
          start.format(dateRangeFormat.sameMonth[0]) +
          dateRangeFormat.separator +
          end.format(dateRangeFormat.sameMonth[1])
        );
      }
    } else {
      return (
        start.format(dateRangeFormat.sameYear[0]) +
        dateRangeFormat.separator +
        end.format(dateRangeFormat.sameYear[1])
      );
    }
  } else {
    return (
      start.format(dateRangeFormat.date) +
      dateRangeFormat.separator +
      end.format(dateRangeFormat.date)
    );
  }
}

export function getAttributeBooleanFormattedValue(
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

export function getAttributeChoicesFormattedValue(
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

export function getAttributeLookupFormattedValue(value: unknown) {
  return (value as DataLookup<string>)?.name;
}

export function getAttributeRegardingFormattedValue(value: unknown) {
  return (value as DataLookup<string>)?.name;
}

export function getAttributeMoneyFormattedValue(
  value: unknown,
  locale: Locale
) {
  return new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: locale.currency.currency,
    currencySign: locale.currency.currencySign,
    currencyDisplay: locale.currency.currencyDisplay,
  }).format(value as number);
}

function getAttributeNumberFormattedValue(
  attribute: NumberAttribute,
  value: unknown,
  locale: Locale
) {
  if (attribute.format === 'duration') {
    return formatDuration(value as number);
  }

  if (attribute.format === 'time') {
    return dayjs()
      .startOf('day')
      .add(value as number, 'minutes')
      .format(locale.timeFormats.short);
  }

  return new Intl.NumberFormat(locale.locale).format(value as number);
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
  locale: Locale,
  options?: {
    maxCount?: number; // for choices and lookups
    strings?: AttributeFormattedValueStringsSet;
  }
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const region = locale.region;

  switch (attribute.type) {
    case 'boolean':
      return getAttributeBooleanFormattedValue(attribute, value, options);
    case 'choice':
      return getAttributeChoiceFormattedValue(attribute, value);
    case 'choices':
      return getAttributeChoicesFormattedValue(attribute, value);
    case 'date':
      return getAttributeDateFormattedValue(attribute, value, locale);
    case 'daterange':
      return getAttributeDateRangeFormattedValue(value, locale);
    case 'lookup':
      return getAttributeLookupFormattedValue(value);
    case 'lookups':
      return getAttributeLookupsFormattedValue(value, options);
    case 'regarding':
      return getAttributeRegardingFormattedValue(value);
    case 'money':
      return getAttributeMoneyFormattedValue(value, locale);
    case 'number':
      return getAttributeNumberFormattedValue(attribute, value, locale);
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
