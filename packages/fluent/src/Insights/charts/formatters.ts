import {
  AllAxisTick,
  CategoryAxisTick,
  DateAxisTick,
  DateAxisTickFormat,
} from '@headless-adminapp/core/experience/insights';
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
      formatCurrency(sign * (abs / Math.pow(1000, i)), digit) + suffix[i - 1]
    );
  } else {
    return formatCurrency(input, digit);
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

  const formatter = new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    style: 'currency',
    minimumFractionDigits: minDigit,
    maximumFractionDigits: maxDigit,
  });

  return formatter.format(input || 0);
};

export const formatNumber = (
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

  const formatter = new Intl.NumberFormat('en-IN', {
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

function createNumberAxisFormatter(options: FormatNumberOptions) {
  return (value: number) => {
    const info = extractNumberInfo(value);
    if (!info) {
      return '';
    }

    return formatNumber(info.value, options) + info.symbol;
  };
}

function createLongNumberAxisFormatter(options: FormatNumberOptions) {
  return (value: number) => {
    return formatNumber(value, options);
  };
}

function createCurrencyAxisFormatter() {
  return (value: number) => {
    const info = extractNumberInfo(value);
    if (!info) {
      return '';
    }

    return formatCurrency(info.value, 0) + info.symbol;
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

export function createAxisFormatter(tick: AllAxisTick) {
  switch (tick.type) {
    case 'time':
      return createTimeAxisFormatter(tick.format);
    case 'number':
      return createNumberAxisFormatter(tick);
    case 'currency':
      return createCurrencyAxisFormatter();
    case 'category':
      return createCategoryAxisFormatter(tick.options);
    case 'weekday':
      return (value: number) => dayjs().day(value).format('ddd');
    default:
      return (value: unknown) => String(value);
  }
}

type Formatter = (value: unknown) => string;

export function createLongAxisFormatter(tick: AllAxisTick): Formatter {
  switch (tick.type) {
    case 'time':
      return createFullTimeAxisFormatter(tick.format) as Formatter;
    case 'number':
      return createLongNumberAxisFormatter(tick) as Formatter;
    case 'currency':
      return createCurrencyAxisFormatter() as Formatter;
    case 'category':
      return createCategoryAxisFormatter(tick.options) as Formatter;
    case 'weekday':
      return ((value: number) =>
        dayjs().day(value).format('dddd')) as Formatter;
    default:
      return (value: unknown) => String(value);
  }
}
