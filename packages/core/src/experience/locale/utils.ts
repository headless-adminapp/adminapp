import {
  DEFAULT_CURRENCY,
  DEFAULT_DATE_FORMATS,
  DEFAULT_DATE_RANGE_FORMATS,
  DEFAULT_TIME_FORMATS,
} from './constants';
import { Locale } from './types';

export function getLocale(
  locale: string,
  timezone: string,
  options?: {
    direction?: Locale['direction'];
    dateFormats?: Locale['dateFormats'];
    dateRangeFormats?: Locale['dateRangeFormats'];
    timeFormats?: Locale['timeFormats'];
    currency?: Partial<Locale['currency']>;
  }
): Locale {
  const localeInfo = new Intl.Locale(locale);
  const language = localeInfo.language;
  let direction = options?.direction;

  if (!direction && 'textInfo' in localeInfo) {
    direction = (localeInfo.textInfo as any).direction;
  }

  return {
    locale,
    region: localeInfo.region ?? 'US',
    direction: direction ?? 'ltr',
    language,
    timezone,
    dateFormats: {
      short: options?.dateFormats?.short ?? DEFAULT_DATE_FORMATS.short,
      long: options?.dateFormats?.long ?? DEFAULT_DATE_FORMATS.long,
    },
    timeFormats: {
      short: options?.timeFormats?.short ?? DEFAULT_TIME_FORMATS.short,
    },
    dateRangeFormats: {
      short:
        options?.dateRangeFormats?.short ?? DEFAULT_DATE_RANGE_FORMATS.short,
      long: options?.dateRangeFormats?.long ?? DEFAULT_DATE_RANGE_FORMATS.long,
    },
    numberFormats: {},
    currency: {
      currency: options?.currency?.currency ?? DEFAULT_CURRENCY.currency,
      currencySign:
        options?.currency?.currencySign ?? DEFAULT_CURRENCY.currencySign,
      currencyDisplay:
        options?.currency?.currencyDisplay ?? DEFAULT_CURRENCY.currencyDisplay,
    },
  };
}

export function getCurrencySymbol(locale: string, currencyCode: string) {
  const currency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
  });

  return (
    currency.formatToParts(1).find((part) => part.type === 'currency')?.value ??
    currencyCode
  );
}
