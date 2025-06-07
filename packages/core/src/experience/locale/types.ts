export type DateRangeFormat = {
  separator: string;
  date: string;
  sameMonth: [string, string];
  sameYear: [string, string];
};

export type DateFormats = {
  short: string;
  long: string;
};

export type TimeFormats = {
  short: string;
};

export type CurrencyFormats = {
  currency: string;
  currencySign: 'standard' | 'accounting';
  currencyDisplay: 'symbol' | 'narrowSymbol' | 'code';
};

export type Locale = {
  locale: string; // en-US, fr-FR, etc.

  // language and direction are derived from locale
  direction: 'ltr' | 'rtl';
  language: string;
  region: string;

  // date formats
  timezone: string;
  dateFormats: DateFormats;

  dateRangeFormats: {
    short: DateRangeFormat;
    long: DateRangeFormat;
  };

  // time formats
  timeFormats: TimeFormats;

  // number formats (decimal symbol, digit grouping, negative format, etc.)
  numberFormats: {};

  // currency formats (extends number formats, withSpace, currency, position, negative, etc.)
  currency: CurrencyFormats;
};
