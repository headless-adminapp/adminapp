export type Locale = {
  locale: string; // en-US, fr-FR, etc.

  // language and direction are derived from locale
  direction: 'ltr' | 'rtl';
  language: string;

  // date formats
  timezone: string;
  dateFormats: {
    short: string;
    long: string;
  };

  // time formats
  timeFormats: {
    short: string;
  };

  // number formats (decimal symbol, digit grouping, negative format, etc.)
  numberFormats: {};

  // currency formats (extends number formats, withSpace, currency, position, negative, etc.)
  currency: {
    currency: string;
    currencySign: 'standard' | 'accounting';
    currencyDisplay: 'symbol' | 'narrowSymbol' | 'code';
  };
};
