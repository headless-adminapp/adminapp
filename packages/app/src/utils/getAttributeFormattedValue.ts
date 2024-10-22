import {
  Attribute,
  DataLookup,
  InferredAttributeType,
} from '@headless-adminapp/core/attributes';
import dayjs from 'dayjs';

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
const defaultLocale = 'en-US';
const defaultCurrency = 'USD';
const defaultCurrencySign = 'accounting';
const defaultCurrencyDisplay = 'symbol';

export function getAttributeFormattedValue<A extends Attribute = Attribute>(
  attribute: Attribute,
  value: InferredAttributeType<A> | null | undefined,
  options?: {
    maxCount?: number; // for choices and lookups
    strings?: AttributeFormattedValueStringsSet;
    dateFormat?: string;
    locale?: string;
    currency?: string;
    currencySign?: 'accounting' | 'standard';
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code';
  }
): string | null | undefined {
  if (value === null || value === undefined) {
    return null;
  }

  const strings = options?.strings ?? defaultAttributeFormattedValueStrings;
  const dateFormat = options?.dateFormat ?? defaultDateFormat;
  const locale = options?.locale ?? defaultLocale;
  const currency = options?.currency ?? defaultCurrency;
  const currencySign = options?.currencySign ?? defaultCurrencySign;
  const currencyDisplay = options?.currencyDisplay ?? defaultCurrencyDisplay;

  switch (attribute.type) {
    case 'boolean':
      return value
        ? attribute.trueLabel ?? strings.yes
        : attribute.falseLabel ?? strings.no;
    case 'choice':
      return (
        attribute.options.find((option) => option.value === value) ?? {
          label: '',
        }
      ).label;
    case 'choices':
      return (value as string[])
        .map((v) => {
          return (
            attribute.options.find((option) => option.value === v) ?? {
              label: '',
            }
          ).label;
        })
        .join(', ');
    case 'date':
      return dayjs(value as string).format(dateFormat);
    case 'daterange':
      if (!value) return null;

      const from = (value as string[])[0];
      const to = (value as string[])[1];

      if (!from && !to) {
        return null;
      }

      if (from && to) {
        return (
          dayjs(from).format(dateFormat) + ' - ' + dayjs(to).format(dateFormat)
        );
      }

      if (from) {
        return 'After ' + dayjs(from).format(dateFormat);
      }

      if (to) {
        return 'Before ' + dayjs(to).format(dateFormat);
      }

      return null;
    case 'lookup':
      return (value as unknown as DataLookup<string>)?.name;
    case 'lookups':
      const items = (value as unknown as DataLookup<string>[])?.map(
        (v) => v.name
      );

      if (options?.maxCount && items?.length > options.maxCount) {
        return (
          items.slice(0, options.maxCount).join(', ') +
          ` (+${items.length - options.maxCount})`
        );
      } else {
        return items?.join(', ');
      }
    case 'money':
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencySign,
        currencyDisplay,
      }).format(value as number);
    case 'number':
      return new Intl.NumberFormat(locale).format(value as number);
    default:
      return typeof value === 'object'
        ? JSON.stringify(value)
        : (value as string);
  }
}
