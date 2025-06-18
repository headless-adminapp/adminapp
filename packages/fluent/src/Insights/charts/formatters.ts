import {
  AllAxisTick,
  CategoryAxisTick,
  DateAxisTick,
  DateAxisTickFormat,
} from '@headless-adminapp/core/experience/insights';
import { Locale } from '@headless-adminapp/core/experience/locale';
import dayjs from 'dayjs';

interface FormatNumberOptions {
  digit?: number;
  minDigit?: number;
  maxDigit?: number;
}

function extractNumberInfo(value: number) {
  const suffix = ['K', 'M', 'B', 'T'];

  if (value === null || value === undefined) {
    return null;
  }

  const abs = Math.abs(value);
  const sign = Math.sign(value);

  if (abs >= 1000) {
    const i = Math.floor(Math.log(abs) / Math.log(1000));
    return {
      value: sign * (abs / Math.pow(1000, i)),
      symbol: suffix[i - 1],
    };
  } else {
    return {
      value: value,
      symbol: '',
    };
  }
}

export const formatCurrencyWithSuffix = (
  locale: Locale,
  input: number | undefined | null,
  digit: number | FormatNumberOptions = 2
) => {
  const suffix = ['K', 'M', 'B', 'T'];

  if (input === null || input === undefined) {
    return '';
  }

  const abs = Math.abs(input);
  const sign = Math.sign(input);

  if (abs >= 1000) {
    const i = Math.floor(Math.log(abs) / Math.log(1000));
    return (
      formatCurrency(locale, sign * (abs / Math.pow(1000, i)), digit) +
      suffix[i - 1]
    );
  } else {
    return formatCurrency(locale, input, digit);
  }
};

export const formatDate = (
  input: Date | string | number | undefined | null,
  format: string
) => {
  if (!input) {
    return '';
  }

  return dayjs(new Date(input)).format(format);
};

export const formatCurrency = (
  locale: Locale,
  input: number | undefined | null,
  digit: number | FormatNumberOptions = 2
) => {
  if (input === null || input === undefined) {
    return '';
  }

  const minDigit =
    typeof digit === 'object' ? digit.minDigit ?? digit.digit : digit;
  const maxDigit =
    typeof digit === 'object' ? digit.maxDigit ?? digit.digit : digit;

  const formatter = new Intl.NumberFormat(locale.locale, {
    style: 'currency',
    currency: locale.currency.currency,
    minimumFractionDigits: minDigit,
    maximumFractionDigits: maxDigit,
  });

  return formatter.format(input || 0);
};

export const formatNumber = (
  locale: Locale,
  input: number | undefined | null,
  digit: number | FormatNumberOptions = 2
) => {
  if (input === null || input === undefined) {
    return '';
  }

  const minDigit =
    typeof digit === 'object' ? digit.minDigit ?? digit.digit : digit;
  const maxDigit =
    typeof digit === 'object' ? digit.maxDigit ?? digit.digit : digit;

  const formatter = new Intl.NumberFormat(locale.locale, {
    minimumFractionDigits: minDigit,
    maximumFractionDigits: maxDigit,
  });

  return formatter.format(input || 0);
};

const timeAxisFormats: Record<DateAxisTickFormat, string> = {
  minute: 'mm',
  hour: 'HH',
  day: 'DD',
  month: 'MMM',
  year: 'YYYY',
  time: 'HH:mm',
  date: 'DD MMM YYYY',
  'year:month': 'MMM YYYY',
  'month:day': 'DD MMM',
  datetime: 'DD MMM YYYY, HH:mm',
};

const timeLongAxisFormats: Record<DateAxisTickFormat, string> = {
  minute: 'HH:mm',
  hour: 'DD MMM, HH:mm',
  day: 'DD MMM YYYY',
  month: 'MMM YYYY',
  year: 'YYYY',
  time: 'DD MMM YYYY, HH:mm',
  date: 'DD MMM YYYY',
  'year:month': 'MMM YYYY',
  'month:day': 'DD MMM YYYY',
  datetime: 'DD MMM YYYY, HH:mm',
};

// const numberAxisFormatters = {
//   decimal: (value: number) => formatCurrency(value, { digit: 2 }),
//   integer: (value: number) => formatCurrency(value, { digit: 0 }),
// };

// const currencyAxisFormatters = {
//   currency: (value: number) => formatCurrency(value, { digit: 0 }),
// };

function createTimeAxisFormatter(format: DateAxisTick['format']) {
  const formatString = timeAxisFormats[format];
  return (value: number) => formatDate(new Date(value), formatString);
}

function createFullTimeAxisFormatter(format: DateAxisTick['format']) {
  const formatString = timeLongAxisFormats[format];
  return (value: number) => formatDate(new Date(value), formatString);
}

function createNumberAxisFormatter(
  locale: Locale,
  options: FormatNumberOptions
) {
  return (value: number) => {
    const info = extractNumberInfo(value);
    if (!info) {
      return '';
    }

    return formatNumber(locale, info.value, options) + info.symbol;
  };
}

function createLongNumberAxisFormatter(
  locale: Locale,
  options: FormatNumberOptions
) {
  return (value: number) => {
    return formatNumber(locale, value, options);
  };
}

function createCurrencyAxisFormatter(locale: Locale) {
  return (value: number) => {
    const info = extractNumberInfo(value);
    if (!info) {
      return '';
    }

    let maxDigit: number = 0;

    if (info.symbol) {
      if (Math.abs(info.value) < 10) {
        maxDigit = 2;
      } else if (Math.abs(info.value) < 100) {
        maxDigit = 1;
      }
    }

    return (
      formatCurrency(locale, info.value, {
        maxDigit,
      }) + info.symbol
    );
  };
}

function createCategoryAxisFormatter(options: CategoryAxisTick['options']) {
  return (value: string | number) => {
    if (options) {
      const option = options.find((o) => o.value === value);

      if (option) {
        return option.label;
      }
    }

    return typeof value === 'string' ? value : String(value);
  };
}

export function createAxisFormatter(locale: Locale, tick: AllAxisTick) {
  switch (tick.type) {
    case 'time':
      return createTimeAxisFormatter(tick.format);
    case 'number':
      return createNumberAxisFormatter(locale, tick);
    case 'currency':
      return createCurrencyAxisFormatter(locale);
    case 'category':
      return createCategoryAxisFormatter(tick.options);
    case 'weekday':
      return (value: number) => dayjs().day(value).format('ddd');
    default:
      return (value: unknown) => String(value);
  }
}

export type Formatter = (value: unknown) => string;

export function createLongAxisFormatter(
  locale: Locale,
  tick: AllAxisTick
): Formatter {
  switch (tick.type) {
    case 'time':
      return createFullTimeAxisFormatter(tick.format) as Formatter;
    case 'number':
      return createLongNumberAxisFormatter(locale, tick) as Formatter;
    case 'currency':
      return createCurrencyAxisFormatter(locale) as Formatter;
    case 'category':
      return createCategoryAxisFormatter(tick.options) as Formatter;
    case 'weekday':
      return ((value: number) =>
        dayjs().day(value).format('dddd')) as Formatter;
    default:
      return (value: unknown) => String(value);
  }
}
