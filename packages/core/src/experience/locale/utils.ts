import { Locale } from './types';

export function getLocale(
  locale: string,
  timezone: string,
  options?: {
    direction?: Locale['direction'];
    dateFormats?: Locale['dateFormats'];
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
      short: options?.dateFormats?.short ?? 'M/D/YYYY',
      long: options?.dateFormats?.long ?? 'ddd, MMM D, YYYY',
    },
    timeFormats: {
      short: options?.timeFormats?.short ?? 'hh:mm A',
    },
    numberFormats: {},
    currency: {
      currency: options?.currency?.currency ?? 'USD',
      currencySign: options?.currency?.currencySign ?? 'standard',
      currencyDisplay: options?.currency?.currencyDisplay ?? 'symbol',
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
