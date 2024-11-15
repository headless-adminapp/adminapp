import { getCurrencySymbol } from '@headless-adminapp/core/experience/locale/utils';
import { useMemo } from 'react';

import { useLocale } from './useLocale';

export function useCurrencySymbol() {
  const locale = useLocale();

  return useMemo(() => {
    return getCurrencySymbol(locale.locale, locale.currency.currency ?? 'USD');
  }, [locale]);
}
