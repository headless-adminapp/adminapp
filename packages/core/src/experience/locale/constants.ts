import { CurrencyFormats, DateFormats, DateRangeFormat } from './types';

export const DEFAULT_DATE_FORMATS: DateFormats = {
  short: 'M/D/YYYY',
  long: 'ddd, MMM D, YYYY',
};

export const DEFAULT_TIME_FORMATS = {
  short: 'hh:mm A',
};

export const DEFAULT_DATE_RANGE_FORMATS = {
  short: {
    separator: ' - ',
    date: 'M/D/YYYY',
    sameMonth: ['M/D', 'D/YYYY'],
    sameYear: ['M/D', 'M/D/YYYY'],
  } as DateRangeFormat,
  long: {
    separator: ' - ',
    date: 'MMM D, YYYY',
    sameMonth: ['MMM D', 'D, YYYY'],
    sameYear: ['MMM D', 'MMM D, YYYY'],
  } as DateRangeFormat,
};

export const DEFAULT_CURRENCY: CurrencyFormats = {
  currency: 'USD',
  currencySign: 'standard',
  currencyDisplay: 'symbol',
};

export const DEFAULT_LOCALE = 'en-US';
