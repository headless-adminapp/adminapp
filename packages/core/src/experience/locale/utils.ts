import { Locale } from './types';

export function getLocale(
  locale: string,
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
    direction: direction ?? 'ltr',
    language,
    dateFormats: {
      short: options?.dateFormats?.short ?? 'M/D/YYYY',
      long: options?.dateFormats?.long ?? 'WWW, MMM D, YYYY',
    },
    timeFormats: {
      short: 'hh:mm aa',
    },
    numberFormats: {},
    currency: {
      currency: 'USD',
      currencySign: 'standard',
      currencyDisplay: 'symbol',
    },
  };
}
