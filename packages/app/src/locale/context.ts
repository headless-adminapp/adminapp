import { Locale } from '@headless-adminapp/core/experience/locale';
import { createContext } from 'react';

export const LocaleContext = createContext<Locale | null>(null);
