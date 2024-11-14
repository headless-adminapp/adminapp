import { getLocale, Locale } from '@headless-adminapp/core/experience/locale';
import { FC, PropsWithChildren, useMemo } from 'react';

import { LocaleContext } from './context';

export interface LocaleProviderProps {
  locale?: string;
  options?: {
    direction?: Locale['direction'];
    dateFormats?: Locale['dateFormats'];
    timeFormats?: Locale['timeFormats'];
    currency?: Partial<Locale['currency']>;
  };
}

export const LocaleProvider: FC<PropsWithChildren<LocaleProviderProps>> = ({
  children,
  locale = 'en-US',
  options,
}) => {
  const localeState = useMemo(() => {
    return getLocale(locale, options);
  }, [locale, options]);
  return (
    <LocaleContext.Provider value={localeState}>
      {children}
    </LocaleContext.Provider>
  );
};
